import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GameMode } from '../../common/enums/game-mode.enum';
import { normalizePhoneE164Input } from '../../common/lib/phone-e164.util';
import { isPitchsideCityName } from '../../common/pitchside-cities';
import { PrismaService } from '../../prisma/prisma.service';
import { JoinRestrictionAppealDto } from './dto/join-restriction-appeal.dto';
import { PlayerSearchResultDto } from './dto/player-search-result.dto';
import { UpdateHomeModeDto } from './dto/update-home-mode.dto';
import { UpdateProfileContactDto } from './dto/update-profile-contact.dto';
import { UpdateProfilePrivacyDto } from './dto/update-profile-privacy.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { FeedbackTagCountDto, RivalBriefDto, UserProfileDto } from './dto/user-profile.dto';

type ProfileRow = {
  userId: string;
  displayName: string;
  photoUrl: string | null;
  city: string;
  dateOfBirth: Date | null;
  ageGroup: string;
  primaryMode: string;
  onboardingStep: number;
  onboardingCompleted: boolean;
  gender: string | null;
  showWomenOnlyGames: boolean;
  gamesAttendedCount: number;
  gamesConfirmedCount: number;
  noShowCountLast30d: number;
  profileModes: { mode: string }[];
  phoneE164: string | null;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: { profileModes: true },
        },
      },
    });
    if (!user?.profile) {
      throw new NotFoundException('Profile not found');
    }
    const base = this.mapProfileBase(user.email, user.profile as ProfileRow);
    const [extras, neg] = await Promise.all([
      this.publicProfileExtras(userId, user.profile as ProfileRow, user.hostedConfirmedGameCount),
      this.privateNegativeTags(userId),
    ]);
    return {
      ...base,
      ...extras,
      gender: user.profile.gender ?? undefined,
      showWomenOnlyGames: user.profile.showWomenOnlyGames,
      privateNegativeTags: neg,
      joinRestrictedUntil: user.joinRestrictedUntil?.toISOString(),
      phoneOnFile: Boolean(user.profile.phoneE164),
    };
  }

  async getById(id: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: { profileModes: true },
        },
      },
    });
    if (!user?.profile) {
      throw new NotFoundException('User not found');
    }
    const base = this.mapProfileBase(undefined, user.profile as ProfileRow);
    const extras = await this.publicProfileExtras(id, user.profile as ProfileRow, user.hostedConfirmedGameCount);
    return { ...base, ...extras };
  }

  async updateProfilePrivacy(userId: string, dto: UpdateProfilePrivacyDto): Promise<UserProfileDto> {
    await this.requireProfile(userId);
    await this.prisma.profile.update({
      where: { userId },
      data: {
        ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
        ...(dto.showWomenOnlyGames !== undefined ? { showWomenOnlyGames: dto.showWomenOnlyGames } : {}),
      },
    });
    return this.getMe(userId);
  }

  async submitJoinRestrictionAppeal(userId: string, dto: JoinRestrictionAppealDto): Promise<void> {
    const u = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { joinRestrictedUntil: true },
    });
    if (!u?.joinRestrictedUntil || u.joinRestrictedUntil <= new Date()) {
      throw new BadRequestException('You do not have an active join restriction to appeal');
    }
    await this.prisma.attendanceRestrictionAppeal.create({
      data: {
        userId,
        message: dto.message.trim(),
      },
    });
  }

  async updatePreferences(userId: string, dto: UpdateUserPreferencesDto): Promise<UserProfileDto> {
    const profile = await this.requireProfile(userId);
    if (!dto.activeModes.includes(dto.primaryMode ?? dto.activeModes[0])) {
      throw new BadRequestException('primaryMode must be one of activeModes');
    }
    const trimmedCity = dto.city.trim();
    if (!isPitchsideCityName(trimmedCity)) {
      throw new BadRequestException('Choose a supported city from the list.');
    }
    const primary = dto.primaryMode ?? dto.activeModes[0];
    await this.prisma.$transaction([
      this.prisma.profileMode.deleteMany({ where: { profileId: profile.id } }),
      ...dto.activeModes.map((mode) =>
        this.prisma.profileMode.create({
          data: { profileId: profile.id, mode },
        }),
      ),
      this.prisma.profile.update({
        where: { id: profile.id },
        data: {
          city: trimmedCity,
          primaryMode: primary,
        },
      }),
    ]);
    return this.getMe(userId);
  }

  async updateProfileContact(userId: string, dto: UpdateProfileContactDto): Promise<UserProfileDto> {
    await this.requireProfile(userId);
    const next =
      dto.phoneE164 === undefined
        ? undefined
        : dto.phoneE164 === null || String(dto.phoneE164).trim() === ''
          ? null
          : normalizePhoneE164Input(String(dto.phoneE164));
    if (
      dto.phoneE164 !== undefined &&
      dto.phoneE164 !== null &&
      String(dto.phoneE164).trim() !== '' &&
      !next
    ) {
      throw new BadRequestException('phoneE164 must be valid E.164 (e.g. +919876543210)');
    }
    try {
      await this.prisma.profile.update({
        where: { userId },
        data: { phoneE164: next === undefined ? undefined : next },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('That phone is already linked to another account');
      }
      throw e;
    }
    return this.getMe(userId);
  }

  async searchPlayers(viewerUserId: string, q: string): Promise<PlayerSearchResultDto[]> {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      throw new BadRequestException('Type at least 2 characters to search');
    }
    const take = 25;
    const phone = normalizePhoneE164Input(trimmed);
    const or: Prisma.ProfileWhereInput[] = [
      { displayName: { contains: trimmed, mode: 'insensitive' } },
    ];
    if (phone) {
      or.push({ phoneE164: phone });
    }
    if (trimmed.length >= 20 && /^[a-z0-9]+$/i.test(trimmed)) {
      or.push({ userId: trimmed });
    }
    const rows = await this.prisma.profile.findMany({
      where: {
        userId: { not: viewerUserId },
        onboardingCompleted: true,
        OR: or,
      },
      select: {
        userId: true,
        displayName: true,
        city: true,
        primaryMode: true,
        photoUrl: true,
      },
      take,
      orderBy: { displayName: 'asc' },
    });
    return rows.map((r) => ({
      userId: r.userId,
      displayName: r.displayName.trim(),
      city: r.city,
      primaryMode: r.primaryMode as GameMode,
      photoUrl: r.photoUrl ?? undefined,
    }));
  }

  async updateHomeMode(userId: string, dto: UpdateHomeModeDto): Promise<UserProfileDto> {
    const profile = await this.requireProfile(userId);
    const activeModes =
      profile.profileModes.length > 0
        ? profile.profileModes.map((m) => m.mode as GameMode)
        : [profile.primaryMode as GameMode];
    if (!activeModes.includes(dto.mode)) {
      throw new BadRequestException('mode must be one of your activeModes');
    }
    await this.prisma.profile.update({
      where: { id: profile.id },
      data: { primaryMode: dto.mode },
    });
    return this.getMe(userId);
  }

  private async requireProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { profileModes: true },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  private mapProfileBase(email: string | undefined, profile: ProfileRow): UserProfileDto {
    const activeModes =
      profile.profileModes.length > 0
        ? profile.profileModes.map((m) => m.mode as GameMode)
        : [profile.primaryMode as GameMode];
    return {
      userId: profile.userId,
      email,
      displayName: profile.displayName,
      city: profile.city,
      activeModes,
      primaryMode: profile.primaryMode as GameMode,
      onboardingStep: profile.onboardingStep,
      onboardingCompleted: profile.onboardingCompleted,
      photoUrl: profile.photoUrl ?? undefined,
      dateOfBirth: profile.dateOfBirth?.toISOString().slice(0, 10),
      ageGroup: profile.ageGroup,
    };
  }

  private async publicProfileExtras(
    targetUserId: string,
    profile: ProfileRow,
    hostedConfirmedGameCount: number,
  ): Promise<Pick<UserProfileDto, 'reliabilityPct' | 'profileAttendanceWarning' | 'verifiedHost' | 'topPositiveTags' | 'topRivals'>> {
    const confirmed = profile.gamesConfirmedCount;
    const attended = profile.gamesAttendedCount;
    const reliabilityPct = confirmed > 0 ? Math.round((Math.min(attended, confirmed) / confirmed) * 100) : 100;

    const [posTags, rivals] = await Promise.all([
      this.prisma.teammateFeedbackTag.groupBy({
        by: ['tagKey'],
        where: { toUserId: targetUserId, isPositive: true },
        _count: { tagKey: true },
        orderBy: { _count: { tagKey: 'desc' } },
        take: 3,
      }),
      this.loadRivals(targetUserId),
    ]);

    const topPositiveTags: FeedbackTagCountDto[] = posTags.map((t) => ({
      tagKey: t.tagKey,
      count: t._count.tagKey,
    }));

    return {
      reliabilityPct,
      profileAttendanceWarning: profile.noShowCountLast30d >= 2,
      verifiedHost: hostedConfirmedGameCount >= 5,
      topPositiveTags,
      topRivals: rivals,
    };
  }

  private async privateNegativeTags(userId: string): Promise<FeedbackTagCountDto[]> {
    const neg = await this.prisma.teammateFeedbackTag.groupBy({
      by: ['tagKey'],
      where: { toUserId: userId, isPositive: false },
      _count: { tagKey: true },
      orderBy: { _count: { tagKey: 'desc' } },
      take: 8,
    });
    return neg.map((t) => ({ tagKey: t.tagKey, count: t._count.tagKey }));
  }

  private async loadRivals(userId: string): Promise<RivalBriefDto[]> {
    const rows = await this.prisma.playerRivalry.findMany({
      where: {
        OR: [{ userLowId: userId }, { userHighId: userId }],
        gamesPlayed: { gte: 3 },
      },
      orderBy: { gamesPlayed: 'desc' },
      take: 3,
    });
    const out: RivalBriefDto[] = [];
    for (const r of rows) {
      const oppId = r.userLowId === userId ? r.userHighId : r.userLowId;
      const opp = await this.prisma.profile.findUnique({
        where: { userId: oppId },
        select: { displayName: true },
      });
      const myWins = r.userLowId === userId ? r.winsForLow : r.winsForHigh;
      const myLosses = r.userLowId === userId ? r.winsForHigh : r.winsForLow;
      out.push({
        opponentUserId: oppId,
        opponentDisplayName: opp?.displayName?.trim() || 'Player',
        myWins,
        myLosses,
        draws: r.draws,
        lastPlayedAt: r.lastPlayedAt?.toISOString(),
      });
    }
    return out;
  }
}
