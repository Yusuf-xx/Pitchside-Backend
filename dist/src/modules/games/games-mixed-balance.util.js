"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceSidesMixed = balanceSidesMixed;
const games_balancing_util_1 = require("./games-balancing.util");
function balanceSidesMixed(gameMode, userIds, positionByUser, womanUserIds, minWomenPerTeam) {
    const pool = new Set(userIds);
    const women = womanUserIds.filter((id) => pool.has(id));
    const k = Math.max(0, minWomenPerTeam);
    if (women.length < k * 2) {
        throw new Error('INSUFFICIENT_WOMEN_FOR_MIXED');
    }
    const womenA = women.slice(0, k);
    const womenB = women.slice(k, k * 2);
    const taken = new Set([...womenA, ...womenB]);
    const rest = userIds.filter((id) => !taken.has(id));
    const sub = (0, games_balancing_util_1.balanceSides)(gameMode, rest, positionByUser);
    return { A: [...womenA, ...sub.A], B: [...womenB, ...sub.B] };
}
//# sourceMappingURL=games-mixed-balance.util.js.map