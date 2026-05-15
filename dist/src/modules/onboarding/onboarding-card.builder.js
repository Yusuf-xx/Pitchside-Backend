"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseOvrFromSkill = baseOvrFromSkill;
exports.rarityFromSkill = rarityFromSkill;
exports.reputationTierFromSkill = reputationTierFromSkill;
exports.statsForMode = statsForMode;
const game_mode_enum_1 = require("../../common/enums/game-mode.enum");
function baseOvrFromSkill(skill, salt) {
    const base = {
        BEGINNER: 68,
        INTERMEDIATE: 74,
        ADVANCED: 80,
        ELITE: 86,
    };
    const bump = [...salt].reduce((a, c) => a + c.charCodeAt(0), 0) % 4;
    return Math.min(99, base[skill] + bump);
}
function rarityFromSkill(skill) {
    const map = {
        BEGINNER: 'STANDARD',
        INTERMEDIATE: 'RISING_STAR',
        ADVANCED: 'CONSISTENT',
        ELITE: 'ELITE',
    };
    return map[skill];
}
function reputationTierFromSkill() {
    return 'REGULAR';
}
function spreadSix(ovr, keys) {
    const deltas = [-4, -2, 0, 1, 2, 3];
    return keys.map((key, i) => ({
        key,
        value: Math.max(40, Math.min(99, ovr + (deltas[i] ?? 0))),
    }));
}
function statsForMode(mode, ovr) {
    if (mode === game_mode_enum_1.GameMode.CRICKET) {
        return spreadSix(ovr, ['BAT', 'BWL', 'FLD', 'STR', 'CON', 'REP']);
    }
    return spreadSix(ovr, ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']);
}
//# sourceMappingURL=onboarding-card.builder.js.map