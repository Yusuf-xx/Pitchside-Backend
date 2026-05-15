import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { profileDobErrorMessage, validateProfileDobYmd } from '../../common/dob-profile.util';
import { isPitchsideCityName } from '../../common/pitchside-cities';
import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import {
  baseOvrFromSkill,
  rarityFromSkill,
  reputationTierFromSkill,
  statsForMode,
} from './onboarding-card.builder';
import { OnboardingFormatsDto } from './dto/onboarding-formats.dto';
import { OnboardingGameIdentityDto } from './dto/onboarding-game-identity.dto';
import { OnboardingPersonalDto } from './dto/onboarding-personal.dto';
import { OnboardingStatusDto } from './dto/onboarding-status.dto';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(userId: string): Promise<OnboardingStatusDto> {
    const profile = await this.requireProfile(userId, { identities: true });
    return this.toStatus(profile);
  }

  async savePersonal(userId: string, dto: OnboardingPersonalDto): Promise<OnboardingStatusDto> {
    if (!dto.activeModes.includes(dto.primaryMode)) {
      throw new BadRequestException('primaryMode must be included in activeModes');
    }
    const profile = await this.requireProfile(userId);
    const trimmedCity = dto.city.trim();
    if (!isPitchsideCityName(trimmedCity)) {
      throw new BadRequestException('Choose a supported city from the list.');
    }
    const dobErr = validateProfileDobYmd(dto.dateOfBirth);
    if (dobErr) {
      throw new BadRequestException(profileDobErrorMessage(dobErr));
    }
    const dob = new Date(dto.dateOfBirth);
    await this.prisma.$transaction([
      this.prisma.profileMode.deleteMany({ where: { profileId: profile.id } }),
      this.prisma.profileMode.createMany({
        data: dto.activeModes.map((mode) => ({ profileId: profile.id, mode })),
      }),
      this.prisma.profile.update({
        where: { id: profile.id },
        data: {
          displayName: dto.displayName.trim(),
          photoUrl: dto.photoUrl?.trim() || null,
          city: trimmedCity,
          dateOfBirth: dob,
          ageGroup: dto.ageGroup,
          primaryMode: dto.primaryMode,
          gender: dto.gender ?? null,
          onboardingStep: Math.max(profile.onboardingStep, 1),
        },
      }),
    ]);
    return this.getStatus(userId);
  }

  async saveGameIdentity(userId: string, dto: OnboardingGameIdentityDto): Promise<OnboardingStatusDto> {
    const profile = await this.requireProfile(userId, { identities: true });
    if (!profile.onboardingCompleted && profile.onboardingStep < 1) {
      throw new BadRequestException('Complete personal step first');
    }
    const expected = new Set<GameMode>(profile.profileModes.map((m) => m.mode as GameMode));
    const got = new Set<GameMode>(dto.identities.map((i) => i.mode));
    if (expected.size !== got.size || [...expected].some((m) => !got.has(m))) {
      throw new BadRequestException('Identities must match selected modes exactly');
    }
    for (const row of dto.identities) {
      if (row.mode === GameMode.FOOTBALL || row.mode === GameMode.FUTSAL) {
        if (!row.preferredFoot?.trim()) {
          throw new BadRequestException(`preferredFoot required for ${row.mode}`);
        }
      }
    }
    await this.prisma.modeIdentity.deleteMany({ where: { profileId: profile.id } });
    await this.prisma.modeIdentity.createMany({
      data: dto.identities.map((i) => ({
        profileId: profile.id,
        mode: i.mode,
        position: i.position.trim(),
        preferredFoot: i.preferredFoot?.trim() ?? null,
        skillLevel: i.skillLevel,
      })),
    });
    await this.prisma.profile.update({
      where: { id: profile.id },
      data: { onboardingStep: Math.max(profile.onboardingStep, 2) },
    });
    if (profile.onboardingCompleted) {
      const refreshed = await this.requireProfile(userId, { identities: true });
      await this.regeneratePlayerCards(userId, refreshed);
    }
    return this.getStatus(userId);
  }

  async saveFormats(userId: string, dto: OnboardingFormatsDto): Promise<OnboardingStatusDto> {
    const profile = await this.requireProfile(userId);
    if (!profile.onboardingCompleted && profile.onboardingStep < 2) {
      throw new BadRequestException('Complete game identity step first');
    }
    await this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        preferredFormatsJson: JSON.stringify(dto.formats),
        onboardingStep: Math.max(profile.onboardingStep, 3),
      },
    });
    return this.getStatus(userId);
  }

  async complete(userId: string): Promise<OnboardingStatusDto> {
    const profile = await this.requireProfile(userId, { identities: true });
    if (profile.onboardingCompleted) {
      return this.toStatus(profile);
    }
    if (profile.onboardingStep < 3) {
      throw new BadRequestException('Complete formats step before finishing');
    }
    if (profile.modeIdentities.length !== profile.profileModes.length) {
      throw new BadRequestException('Missing mode identities');
    }
    await this.regeneratePlayerCards(userId, profile);
    const updated = await this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        onboardingCompleted: true,
        onboardingStep: 4,
      },
      include: { profileModes: true, modeIdentities: true },
    });
    return this.toStatus(updated);
  }

  private async regeneratePlayerCards(
    userId: string,
    profile: {
      id: string;
      profileModes: { mode: string }[];
      modeIdentities: { mode: string; preferredFoot: string | null; skillLevel: string }[];
    },
  ) {
    await this.prisma.playerCard.deleteMany({ where: { profileId: profile.id } });
    for (const pm of profile.profileModes) {
      const ident = profile.modeIdentities.find((m) => m.mode === pm.mode);
      if (!ident) {
        throw new BadRequestException(`Missing identity for mode ${pm.mode}`);
      }
      const mode = pm.mode as GameMode;
      const skill = ident.skillLevel as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
      const ovr = baseOvrFromSkill(skill, userId);
      const rarity = rarityFromSkill(skill);
      const reputationTier = reputationTierFromSkill();
      const stats = statsForMode(mode, ovr);
      await this.prisma.playerCard.create({
        data: {
          profileId: profile.id,
          mode: pm.mode,
          ovr,
          rarity,
          reputationTier,
          stats: {
            create: stats.map((s) => ({ key: s.key, value: s.value })),
          },
          badges: {
            create: [
              { badgeKey: skill },
              ...(mode !== GameMode.CRICKET && ident.preferredFoot
                ? [{ badgeKey: `${ident.preferredFoot}_FOOT` }]
                : []),
            ],
          },
        },
      });
    }
  }

  private async requireProfile(userId: string, opts?: { identities?: boolean }) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        profileModes: true,
        modeIdentities: opts?.identities ?? false,
      },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  private toStatus(
    profile: {
      onboardingStep: number;
      onboardingCompleted: boolean;
      displayName: string;
      city: string;
      primaryMode: string;
      preferredFormatsJson: string | null;
      profileModes: { mode: string }[];
      modeIdentities?: { mode: string; position: string; preferredFoot: string | null; skillLevel: string }[];
    },
  ): OnboardingStatusDto {
    let savedFormats: string[] | undefined;
    if (profile.preferredFormatsJson) {
      try {
        const parsed = JSON.parse(profile.preferredFormatsJson) as unknown;
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
          savedFormats = parsed as string[];
        }
      } catch {
        /* ignore malformed JSON */
      }
    }

    const identities = profile.modeIdentities;
    const savedGameIdentities =
      identities && identities.length > 0
        ? identities.map((m) => ({
            mode: m.mode as GameMode,
            position: m.position,
            preferredFoot: m.preferredFoot ?? undefined,
            skillLevel: m.skillLevel,
          }))
        : undefined;

    return {
      onboardingStep: profile.onboardingStep,
      onboardingCompleted: profile.onboardingCompleted,
      displayName: profile.displayName,
      city: profile.city,
      primaryMode: profile.primaryMode as GameMode,
      activeModes:
        profile.profileModes.length > 0
          ? profile.profileModes.map((m) => m.mode as GameMode)
          : [profile.primaryMode as GameMode],
      savedFormats,
      savedGameIdentities,
    };
  }
}
