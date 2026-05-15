"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const admin_module_1 = require("./modules/admin/admin.module");
const auth_module_1 = require("./modules/auth/auth.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const game_records_module_1 = require("./modules/game-records/game-records.module");
const games_module_1 = require("./modules/games/games.module");
const health_module_1 = require("./modules/health/health.module");
const home_module_1 = require("./modules/home/home.module");
const leaderboards_module_1 = require("./modules/leaderboards/leaderboards.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const onboarding_module_1 = require("./modules/onboarding/onboarding.module");
const partners_module_1 = require("./modules/partners/partners.module");
const player_cards_module_1 = require("./modules/player-cards/player-cards.module");
const squads_module_1 = require("./modules/squads/squads.module");
const teams_module_1 = require("./modules/teams/teams.module");
const tournaments_module_1 = require("./modules/tournaments/tournaments.module");
const training_module_1 = require("./modules/training/training.module");
const turfs_module_1 = require("./modules/turfs/turfs.module");
const users_module_1 = require("./modules/users/users.module");
const waitlist_module_1 = require("./modules/waitlist/waitlist.module");
function requiredPositiveIntEnv(name) {
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
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'default',
                    ttl: requiredPositiveIntEnv('THROTTLE_DEFAULT_TTL_MS'),
                    limit: requiredPositiveIntEnv('THROTTLE_DEFAULT_LIMIT'),
                },
            ]),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            admin_module_1.AdminModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            onboarding_module_1.OnboardingModule,
            player_cards_module_1.PlayerCardsModule,
            games_module_1.GamesModule,
            home_module_1.HomeModule,
            turfs_module_1.TurfsModule,
            bookings_module_1.BookingsModule,
            tournaments_module_1.TournamentsModule,
            teams_module_1.TeamsModule,
            squads_module_1.SquadsModule,
            training_module_1.TrainingModule,
            game_records_module_1.GameRecordsModule,
            leaderboards_module_1.LeaderboardsModule,
            notifications_module_1.NotificationsModule,
            partners_module_1.PartnersModule,
            waitlist_module_1.WaitlistModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map