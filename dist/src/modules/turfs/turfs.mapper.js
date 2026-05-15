"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseModesJson = parseModesJson;
exports.mapTurfRow = mapTurfRow;
const game_mode_enum_1 = require("../../common/enums/game-mode.enum");
function isGameMode(v) {
    return v === game_mode_enum_1.GameMode.FOOTBALL || v === game_mode_enum_1.GameMode.FUTSAL || v === game_mode_enum_1.GameMode.CRICKET;
}
function parseModesJson(modes) {
    if (!Array.isArray(modes))
        return [];
    return modes.filter(isGameMode);
}
const SUB_KEYS = ['CAGE', 'ROOFTOP', 'BEACH', 'STREET_GULLY', 'BOX'];
function parseSubFormats(json) {
    if (!Array.isArray(json))
        return [];
    return json.filter((x) => typeof x === 'string' && SUB_KEYS.includes(x));
}
function mapTurfRow(row) {
    const sub = parseSubFormats(row.footballVenueSubFormats ?? null);
    return {
        id: row.id,
        name: row.name,
        modes: parseModesJson(row.modes),
        footballVenueSubFormats: sub.length ? sub : undefined,
        area: row.area,
        city: row.city,
        rating: row.rating,
        reviewCount: row.reviewCount,
        priceInrPerHour: row.priceInrPerHour,
        partner: row.partner,
        availabilityNote: row.availabilityNote,
    };
}
//# sourceMappingURL=turfs.mapper.js.map