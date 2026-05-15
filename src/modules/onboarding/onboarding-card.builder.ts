import { GameMode } from '../../common/enums/game-mode.enum';

type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';

export function baseOvrFromSkill(skill: SkillLevel, salt: string): number {
  const base: Record<SkillLevel, number> = {
    BEGINNER: 68,
    INTERMEDIATE: 74,
    ADVANCED: 80,
    ELITE: 86,
  };
  const bump = [...salt].reduce((a, c) => a + c.charCodeAt(0), 0) % 4;
  return Math.min(99, base[skill] + bump);
}

export function rarityFromSkill(skill: SkillLevel): string {
  const map: Record<SkillLevel, string> = {
    BEGINNER: 'STANDARD',
    INTERMEDIATE: 'RISING_STAR',
    ADVANCED: 'CONSISTENT',
    ELITE: 'ELITE',
  };
  return map[skill];
}

export function reputationTierFromSkill(): string {
  return 'REGULAR';
}

function spreadSix(ovr: number, keys: string[]): { key: string; value: number }[] {
  const deltas = [-4, -2, 0, 1, 2, 3];
  return keys.map((key, i) => ({
    key,
    value: Math.max(40, Math.min(99, ovr + (deltas[i] ?? 0))),
  }));
}

export function statsForMode(mode: GameMode, ovr: number): { key: string; value: number }[] {
  if (mode === GameMode.CRICKET) {
    return spreadSix(ovr, ['BAT', 'BWL', 'FLD', 'STR', 'CON', 'REP']);
  }
  return spreadSix(ovr, ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']);
}
