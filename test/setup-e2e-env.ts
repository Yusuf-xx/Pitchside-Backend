import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../.env'), quiet: true });

const defaults: Record<string, string> = {
  PORT: '3999',
  CORS_ORIGIN: 'http://localhost:5173',
  THROTTLE_DEFAULT_TTL_MS: '60000',
  THROTTLE_DEFAULT_LIMIT: '120',
  JWT_SECRET: 'e2e-jwt-secret-must-be-at-least-32-chars',
  ACCESS_TOKEN_TTL_SEC: '3600',
  REFRESH_TOKEN_TTL_SEC: '7200',
  BOOKING_PENDING_PAYMENT_TTL_MINUTES: '30',
  PASSWORD_RESET_TOKEN_TTL_MINUTES: '30',
  PASSWORD_RESET_URL_BASE: 'http://localhost:5173/reset-password',
};

for (const [key, value] of Object.entries(defaults)) {
  if (!process.env[key]?.trim()) {
    process.env[key] = value;
  }
}
