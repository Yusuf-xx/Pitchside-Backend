# Pitchside — Backend

REST API for **Pitchside**: mobile-first identity, pickup games, partner turfs, bookings, tournaments, teams/squads, training check-ins, player cards (OVR/stats), leaderboards, and notifications. Game modes: **Football**, **Futsal**, **Cricket**.

Built with **NestJS 11**, **Prisma**, and **PostgreSQL** (hosted on **Supabase** in typical setups). Authentication is **application-owned** (bcrypt + JWT), not Supabase Auth.

The Vite React client lives in [`../frontend`](../frontend).

## Relationship to the frontend

| Topic | Detail |
| --- | --- |
| Default port | `3000` (`PORT`) |
| Global prefix | `/api/v1` (all controllers) |
| CORS | `CORS_ORIGIN` — comma-separated allowed origins; dev default `http://localhost:5173` |
| Frontend env | Client uses `VITE_API_BASE_URL=http://localhost:3000` |
| Password reset links | `PASSWORD_RESET_URL_BASE` must point at the frontend route (e.g. `http://localhost:5173/reset-password`) |
| Swagger | When enabled, UI at `/docs`, JSON at `/docs-json` |

Run API and frontend together from the repo root:

```powershell
npm run dev:backend
npm run dev:frontend
```

Or from this folder:

```powershell
npm install
npm run start:dev
```

Health check: `GET http://localhost:3000/api/v1/health`

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **PostgreSQL** database (Supabase project or local Postgres)
- Connection strings for Prisma:
  - **`DATABASE_URL`** — pooler URL for the app (Supabase pooler port **6543** with `?pgbouncer=true&connection_limit=1` when using PgBouncer)
  - **`DIRECT_URL`** — direct connection for migrations (Supabase port **5432**)

## Environment

```powershell
Copy-Item .env.example .env
```

Fill in your database URLs and secrets. Never commit `.env`.

### Required variables

| Variable | Description |
| --- | --- |
| `PORT` | HTTP port (e.g. `3000`) |
| `CORS_ORIGIN` | Allowed browser origins (comma-separated). Include the frontend dev URL. |
| `DATABASE_URL` | Prisma datasource URL (PostgreSQL) |
| `DIRECT_URL` | Direct Postgres URL for `prisma migrate` |
| `JWT_SECRET` | Signing secret for access/refresh tokens (use a long random string) |
| `ACCESS_TOKEN_TTL_SEC` | Access token lifetime (integer ≥ 60) |
| `REFRESH_TOKEN_TTL_SEC` | Refresh token lifetime (must be **greater than** access TTL) |
| `THROTTLE_DEFAULT_TTL_MS` | Rate-limit window (ms) |
| `THROTTLE_DEFAULT_LIMIT` | Max requests per window per IP |
| `BOOKING_PENDING_PAYMENT_TTL_MINUTES` | How long a booking stays pending payment |
| `PASSWORD_RESET_TOKEN_TTL_MINUTES` | Reset link expiry |
| `PASSWORD_RESET_URL_BASE` | Frontend base URL for reset links (no trailing path beyond what your route expects) |

### Optional / feature-specific

| Variable | Description |
| --- | --- |
| `ENABLE_SWAGGER` | `true` / `false`. Defaults to on when `NODE_ENV` is not `production`. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Required when users call **forgot password** (email delivery) |
| `ADMIN_EMAILS` | Comma-separated user emails allowed for admin endpoints via JWT |
| `ADMIN_API_KEY` | Shared secret; send as header `X-Admin-Key` for admin/partner ops |

## Database and Prisma

Schema: `prisma/schema.prisma`. Migrations: `prisma/migrations/`.

From the **repo root** (recommended):

```powershell
npm run db:generate    # prisma generate
npm run db:migrate     # prisma migrate dev (local)
npm run db:deploy      # prisma migrate deploy (hosted/prod)
npm run db:status      # migration status
npm run db:seed        # seed script (tsx prisma/seed.ts)
npm run db:studio      # Prisma Studio GUI
```

From this folder, the same commands exist under `npm run prisma:*` (see `package.json`). `postinstall` runs `prisma generate` automatically.

Use **`db:migrate`** during development and **`db:deploy`** in CI/production.

## Scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Watch mode (runs `prisma generate` first) |
| `npm run start` | Single run without watch |
| `npm run start:prod` | `node dist/main` after `npm run build` |
| `npm run build` | `prisma generate` + Nest compile to `dist/` |
| `npm run typecheck` | Generate client + `tsc --noEmit` |
| `npm run test` | Unit tests (`*.spec.ts` under `src/`) |
| `npm run test:e2e` | E2E smoke (health module; no DB required) |
| `npm run lint` | ESLint |

## API overview

- **Base path:** `/api/v1`
- **Auth:** `Authorization: Bearer <accessToken>` on protected routes
- **Validation:** global `ValidationPipe` (whitelist, transform)
- **Rate limiting:** `@nestjs/throttler` (global guard)
- **Errors:** consistent JSON via `AllExceptionsFilter`

### Main modules (Swagger tags)

| Tag | Area |
| --- | --- |
| Health | `GET /api/v1/health` |
| Auth | Register, login, refresh, logout, forgot/reset password |
| Users / Onboarding | Profiles and setup |
| Player Cards | OVR, stats, badges |
| Games | Create, join, discover games |
| Home | Dashboard feed |
| Turfs / Bookings | Partner venues and split-pay bookings |
| Tournaments / Teams | Competitions and squads |
| Training | Clock-in/out, weekly goals, IST-based streaks |
| Game Records / Leaderboards | Post-match stats and rankings |
| Notifications | In-app notifications |
| Admin / Partners / Waitlist | Ops, turf interest CRM, scout waitlist |

Interactive docs (when Swagger is enabled): **http://localhost:3000/docs**

## Authentication model

- Users are rows in Postgres (`User` + `Profile`), passwords hashed with **bcrypt**
- **Access** and **refresh** JWTs issued by this API (`JWT_SECRET`)
- `sessionVersion` on the user invalidates tokens on password reset / logout-all
- Frontend stores tokens and refreshes on 401 — see [frontend README](../frontend/README.md)

## Admin access

Some routes (feed events, appeals, partner turf interest) require either:

- Header `X-Admin-Key: <ADMIN_API_KEY>`, or  
- Bearer JWT for a user whose email is listed in `ADMIN_EMAILS`

## Testing

```powershell
npm run test        # unit
npm run test:e2e    # health smoke without DATABASE_URL
```

E2E setup (`test/setup-e2e-env.ts`) supplies safe defaults for `PORT`, `CORS_ORIGIN`, JWT, and throttling when variables are unset. Full `AppModule` e2e against a real database is intended for staging with a dedicated `DATABASE_URL`.

## Production notes

1. Set `NODE_ENV=production` and configure all required env vars.
2. Run `npm run build` then `npm run start:prod` (or your process manager).
3. Apply migrations with `npm run prisma:deploy` (or root `npm run db:deploy`).
4. Set `CORS_ORIGIN` to your real frontend origin(s).
5. Set `ENABLE_SWAGGER=false` unless you explicitly want public API docs.
6. Configure SMTP if password reset email is required.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `PORT is required` / `JWT_SECRET is required` | Incomplete `.env` |
| Prisma / DB connection errors | Wrong `DATABASE_URL`, pooler without `pgbouncer=true`, or migrations not applied |
| CORS blocked from browser | `CORS_ORIGIN` missing the frontend URL |
| Forgot password 503 | SMTP variables not set |
| `REFRESH_TOKEN_TTL_SEC must be greater than ACCESS_TOKEN_TTL_SEC` | Invalid TTL pair |

## Further reading

- [Frontend README](../frontend/README.md) — how the client calls this API
- [Root README](../README.md) — monorepo layout, Supabase vs MySQL notes, shared `dev:*` scripts
