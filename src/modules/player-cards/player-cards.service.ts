import { Injectable, NotFoundException } from '@nestjs/common';
import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { PlayerCardDto } from './dto/player-card.dto';

@Injectable()
export class PlayerCardsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string, mode?: GameMode): Promise<PlayerCardDto> {
    return this.loadCard(userId, mode);
  }

  async getPublic(userId: string, mode?: GameMode): Promise<PlayerCardDto> {
    return this.loadCard(userId, mode);
  }

  private async loadCard(userId: string, mode?: GameMode): Promise<PlayerCardDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            modeIdentities: true,
            playerCards: {
              include: { stats: true, badges: true },
            },
          },
        },
      },
    });
    if (!user?.profile) {
      throw new NotFoundException('Player not found');
    }
    const profile = user.profile;
    const resolvedMode = (mode ?? (profile.primaryMode as GameMode)) as GameMode;
    const card = profile.playerCards.find((c) => c.mode === resolvedMode);
    if (!card) {
      throw new NotFoundException('Player card not available yet — finish onboarding');
    }
    const ident = profile.modeIdentities.find((m) => m.mode === resolvedMode);
    if (!ident) {
      throw new NotFoundException('Missing identity for this mode');
    }
    const confirmed = profile.gamesConfirmedCount;
    const attended = profile.gamesAttendedCount;
    const reliabilityPct = confirmed > 0 ? Math.round((Math.min(attended, confirmed) / confirmed) * 100) : 100;
    return {
      userId,
      displayName: profile.displayName,
      mode: resolvedMode,
      ovr: card.ovr,
      position: ident.position,
      skillLevel: ident.skillLevel,
      preferredFoot: ident.preferredFoot ?? undefined,
      city: profile.city,
      stats: card.stats.map((s) => ({ key: s.key, value: s.value })),
      reputationTier: card.reputationTier,
      rarity: card.rarity,
      badges: card.badges.map((b) => b.badgeKey).filter((k) => k !== 'ONBOARDED'),
      reliabilityPct,
    };
  }
}
