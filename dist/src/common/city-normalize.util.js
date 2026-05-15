"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalizeCityName = canonicalizeCityName;
exports.prismaCityEqualsInsensitive = prismaCityEqualsInsensitive;
const pitchside_cities_1 = require("./pitchside-cities");
const LOWER_TO_CANONICAL = new Map(pitchside_cities_1.PITCHSIDE_CITY_NAMES.map((n) => [n.toLowerCase(), n]));
function canonicalizeCityName(raw) {
    const t = raw.trim();
    if (!t)
        return t;
    return LOWER_TO_CANONICAL.get(t.toLowerCase()) ?? t;
}
function prismaCityEqualsInsensitive(city) {
    return { equals: city.trim(), mode: 'insensitive' };
}
//# sourceMappingURL=city-normalize.util.js.map