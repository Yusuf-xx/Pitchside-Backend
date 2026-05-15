"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSecret = jwtSecret;
exports.accessTokenTtlSec = accessTokenTtlSec;
exports.refreshTokenTtlSec = refreshTokenTtlSec;
function requireEnv(name) {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`${name} is required`);
    }
    return value;
}
function jwtSecret() {
    return requireEnv('JWT_SECRET');
}
function accessTokenTtlSec() {
    const raw = requireEnv('ACCESS_TOKEN_TTL_SEC');
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed < 60) {
        throw new Error('ACCESS_TOKEN_TTL_SEC must be an integer >= 60');
    }
    return parsed;
}
function refreshTokenTtlSec() {
    const raw = requireEnv('REFRESH_TOKEN_TTL_SEC');
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed <= accessTokenTtlSec()) {
        throw new Error('REFRESH_TOKEN_TTL_SEC must be greater than ACCESS_TOKEN_TTL_SEC');
    }
    return parsed;
}
//# sourceMappingURL=auth.constants.js.map