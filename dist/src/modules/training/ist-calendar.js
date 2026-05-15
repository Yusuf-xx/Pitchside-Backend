"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAY_MS = exports.TRAINING_TIME_ZONE = void 0;
exports.getIstYmdParts = getIstYmdParts;
exports.istDateKey = istDateKey;
exports.istWallMidnight = istWallMidnight;
exports.startOfIstIsoWeek = startOfIstIsoWeek;
exports.addIstDaysFromMidnight = addIstDaysFromMidnight;
exports.TRAINING_TIME_ZONE = 'Asia/Kolkata';
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
exports.DAY_MS = 24 * 60 * 60 * 1000;
function getIstYmdParts(d) {
    const f = new Intl.DateTimeFormat('en-CA', {
        timeZone: exports.TRAINING_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const parts = f.formatToParts(d);
    const num = (type) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    return { year: num('year'), month: num('month'), day: num('day') };
}
function istDateKey(d) {
    const { year, month, day } = getIstYmdParts(d);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function istWallMidnight(year, month, day) {
    return new Date(Date.UTC(year, month - 1, day) - IST_OFFSET_MS);
}
function istWeekdayShort(d) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: exports.TRAINING_TIME_ZONE,
        weekday: 'short',
    }).format(d);
}
function startOfIstIsoWeek(now) {
    const { year, month, day } = getIstYmdParts(now);
    let t = istWallMidnight(year, month, day);
    for (let n = 0; n < 8; n++) {
        if (istWeekdayShort(t) === 'Mon')
            return t;
        t = new Date(t.getTime() - exports.DAY_MS);
    }
    return istWallMidnight(year, month, day);
}
function addIstDaysFromMidnight(istMidnight, deltaDays) {
    return new Date(istMidnight.getTime() + deltaDays * exports.DAY_MS);
}
//# sourceMappingURL=ist-calendar.js.map