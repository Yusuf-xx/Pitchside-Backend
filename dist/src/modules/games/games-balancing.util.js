"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceSides = balanceSides;
const crypto_1 = require("crypto");
function balanceSides(gameMode, userIds, positionByUser) {
    const bucket = (pos) => {
        const p = pos.toUpperCase();
        if (gameMode === 'CRICKET') {
            if (p.includes('BAT'))
                return 'BAT';
            if (p.includes('BOWL'))
                return 'BOWL';
            if (p.includes('ALL') || p.includes('ROUND'))
                return 'AR';
            return 'X';
        }
        if (p.includes('GK') || p.includes('GOAL'))
            return 'GK';
        if (p.includes('DEF') || p.includes('BACK'))
            return 'DEF';
        if (p.includes('MID'))
            return 'MID';
        if (p.includes('FWD') || p.includes('STRIKER') || p.includes('FORWARD'))
            return 'FWD';
        return 'X';
    };
    const groups = new Map();
    for (const uid of userIds) {
        const raw = positionByUser.get(uid) ?? '';
        const g = bucket(raw);
        const arr = groups.get(g) ?? [];
        arr.push(uid);
        groups.set(g, arr);
    }
    for (const arr of groups.values()) {
        shuffleInPlace(arr);
    }
    const orderKeys = gameMode === 'CRICKET'
        ? ['BAT', 'BOWL', 'AR', 'X']
        : ['GK', 'DEF', 'MID', 'FWD', 'X'];
    const A = [];
    const B = [];
    let turnA = true;
    for (const key of orderKeys) {
        const arr = groups.get(key) ?? [];
        for (const uid of arr) {
            if (turnA)
                A.push(uid);
            else
                B.push(uid);
            turnA = !turnA;
        }
    }
    return { A, B };
}
function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = (0, crypto_1.randomInt)(i + 1);
        const t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
}
//# sourceMappingURL=games-balancing.util.js.map