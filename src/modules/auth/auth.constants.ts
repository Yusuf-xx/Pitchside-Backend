function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export function jwtSecret(): string {
  return requireEnv('JWT_SECRET');
}

export function accessTokenTtlSec(): number {
  const raw = requireEnv('ACCESS_TOKEN_TTL_SEC');
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 60) {
    throw new Error('ACCESS_TOKEN_TTL_SEC must be an integer >= 60');
  }
  return parsed;
}

export function refreshTokenTtlSec(): number {
  const raw = requireEnv('REFRESH_TOKEN_TTL_SEC');
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= accessTokenTtlSec()) {
    throw new Error('REFRESH_TOKEN_TTL_SEC must be greater than ACCESS_TOKEN_TTL_SEC');
  }
  return parsed;
}
