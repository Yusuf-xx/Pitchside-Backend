import type { PlayerCard, Profile } from '@prisma/client';
import { GameMode } from '../../common/enums/game-mode.enum';
import { TeamDetailDto } from './dto/team-detail.dto';
import { TeamSummaryDto } from './dto/team-summary.dto';

type CardHolder = {
  profile: (Profile & { playerCards: PlayerCard[] }) | null;
};

export function ovrForGameMode(holder: CardHolder | null | undefined, gameMode: string): number | undefined {
  const cards = holder?.profile?.playerCards;
  if (!cards?.length) return undefined;
  const card = cards.find((c) => c.mode === gameMode);
  return card?.ovr;
}

export function averageSquadOvr(
  gameMode: string,
  roster: { user: CardHolder }[],
): number {
  const values = roster
    .map((r) => ovrForGameMode(r.user, gameMode))
    .filter((v): v is number => typeof v === 'number');
  if (values.length === 0) return 70;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function mapTeamToSummary(
  team: {
    id: string;
    name: string;
    city: string;
    gameMode: string;
    kitColorHex: string | null;
    wins: number;
    losses: number;
    draws: number;
    captainUserId: string;
  },
  memberCount: number,
  teamOvr: number,
): TeamSummaryDto {
  return {
    id: team.id,
    name: team.name,
    city: team.city,
    gameMode: team.gameMode as GameMode,
    kitColorHex: team.kitColorHex ?? undefined,
    memberCount,
    captainUserId: team.captainUserId,
    wins: team.wins,
    losses: team.losses,
    draws: team.draws,
    teamOvr,
  };
}

export function mapTeamToDetail(
  team: {
    id: string;
    name: string;
    city: string;
    gameMode: string;
    kitColorHex: string | null;
    wins: number;
    losses: number;
    draws: number;
    captainUserId: string;
    members: {
      userId: string;
      role: string;
      user: CardHolder & { id: string };
    }[];
  },
): TeamDetailDto {
  const memberCount = team.members.length;
  const teamOvr = averageSquadOvr(team.gameMode, team.members.map((m) => ({ user: m.user })));
  const base = mapTeamToSummary(team, memberCount, teamOvr);
  const members = team.members.map((m) => ({
    userId: m.userId,
    displayName: m.user.profile?.displayName ?? 'Player',
    role: m.role,
    ovr: ovrForGameMode(m.user, team.gameMode),
  }));
  return {
    ...base,
    members,
    isCaptain: false,
  };
}

/** Fills `isCaptain` for the requesting user (detail response). */
export function withCaptainFlag(detail: TeamDetailDto, requestUserId: string | undefined): TeamDetailDto {
  if (!requestUserId) return { ...detail, isCaptain: false };
  return {
    ...detail,
    isCaptain: detail.captainUserId === requestUserId,
  };
}
