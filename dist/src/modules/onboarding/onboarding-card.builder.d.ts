import { GameMode } from '../../common/enums/game-mode.enum';
type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
export declare function baseOvrFromSkill(skill: SkillLevel, salt: string): number;
export declare function rarityFromSkill(skill: SkillLevel): string;
export declare function reputationTierFromSkill(): string;
export declare function statsForMode(mode: GameMode, ovr: number): {
    key: string;
    value: number;
}[];
export {};
