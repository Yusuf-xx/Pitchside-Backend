import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { GameRecordsModule } from './modules/game-records/game-records.module';
import { GamesModule } from './modules/games/games.module';
import { HealthModule } from './modules/health/health.module';
import { HomeModule } from './modules/home/home.module';
import { LeaderboardsModule } from './modules/leaderboards/leaderboards.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { PartnersModule } from './modules/partners/partners.module';
import { PlayerCardsModule } from './modules/player-cards/player-cards.module';
import { SquadsModule } from './modules/squads/squads.module';
import { TeamsModule } from './modules/teams/teams.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { TrainingModule } from './modules/training/training.module';
import { TurfsModule } from './modules/turfs/turfs.module';
import { UsersModule } from './modules/users/users.module';
import { WaitlistModule } from './modules/waitlist/waitlist.module';

function requiredPositiveIntEnv(name: string): number {
  const raw = process.env[name]?.trim();
  if (!raw) {
    throw new Error(`${name} is required`);
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: requiredPositiveIntEnv('THROTTLE_DEFAULT_TTL_MS'),
        limit: requiredPositiveIntEnv('THROTTLE_DEFAULT_LIMIT'),
      },
    ]),
    PrismaModule,
    HealthModule,
    AdminModule,
    AuthModule,
    UsersModule,
    OnboardingModule,
    PlayerCardsModule,
    GamesModule,
    HomeModule,
    TurfsModule,
    BookingsModule,
    TournamentsModule,
    TeamsModule,
    SquadsModule,
    TrainingModule,
    GameRecordsModule,
    LeaderboardsModule,
    NotificationsModule,
    PartnersModule,
    WaitlistModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
