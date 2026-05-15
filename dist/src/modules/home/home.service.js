"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const city_normalize_util_1 = require("../../common/city-normalize.util");
const game_mode_enum_1 = require("../../common/enums/game-mode.enum");
const prisma_service_1 = require("../../prisma/prisma.service");
const games_service_1 = require("../games/games.service");
const tournaments_service_1 = require("../tournaments/tournaments.service");
const turfs_service_1 = require("../turfs/turfs.service");
const games_mapper_1 = require("../games/games.mapper");
let HomeService = class HomeService {
    prisma;
    gamesService;
    turfsService;
    tournamentsService;
    constructor(prisma, gamesService, turfsService, tournamentsService) {
        this.prisma = prisma;
        this.gamesService = gamesService;
        this.turfsService = turfsService;
        this.tournamentsService = tournamentsService;
    }
    async getDashboard(opts) {
        const { city, gameMode: modeOverride, userId } = opts;
        const profile = userId
            ? await this.prisma.profile.findUnique({
                where: { userId },
                include: { playerCards: true },
            })
            : null;
        if (userId && !profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const resolvedCity = (profile?.city && profile.city !== 'TBD' ? profile.city : undefined) ?? city?.trim();
        if (!resolvedCity) {
            throw new common_1.BadRequestException('Pass ?city=YourCity as a guest, or set your city on your profile.');
        }
        const resolvedMode = modeOverride ?? profile?.primaryMode ?? game_mode_enum_1.GameMode.FOOTBALL;
        const query = { city: resolvedCity, gameMode: resolvedMode };
        const [nearbyGames, needPlayersAlerts, tournamentSummaries, feedRows, nextRow] = await Promise.all([
            this.gamesService.list(query),
            this.gamesService.needPlayers(query),
            this.tournamentsService.list(query),
            this.prisma.feedEvent.findMany({
                where: {
                    AND: [
                        {
                            OR: [{ city: null }, { city: (0, city_normalize_util_1.prismaCityEqualsInsensitive)(resolvedCity) }],
                        },
                        { OR: [{ gameMode: null }, { gameMode: resolvedMode }] },
                    ],
                },
                orderBy: { createdAt: 'desc' },
                take: 15,
            }),
            userId
                ? this.prisma.game.findFirst({
                    where: {
                        startsAt: { gt: new Date() },
                        participants: { some: { userId } },
                    },
                    orderBy: { startsAt: 'asc' },
                    include: { host: { select: { hostedConfirmedGameCount: true } } },
                })
                : Promise.resolve(null),
        ]);
        const feedFiltered = feedRows;
        const tournamentTeasers = tournamentSummaries.slice(0, 5).map((t) => ({
            id: t.id,
            name: t.name,
            gameMode: t.gameMode,
            city: t.city,
            startsAt: t.startsAt,
            entryFeeInr: t.entryFeeInr,
            prizeInr: t.prizeInr,
            teamsRegistered: t.teamsRegistered,
            teamsCap: t.teamsCap,
            format: t.format,
        }));
        const feed = feedFiltered.map((f) => ({
            id: f.id,
            type: f.type,
            title: f.title,
            body: f.body,
            gameMode: f.gameMode ?? undefined,
            createdAt: f.createdAt.toISOString(),
        }));
        const turfList = await this.turfsService.list(query);
        const nearbyTurfs = turfList.slice(0, 4);
        let greetingName = 'Player';
        let playerOvr;
        if (profile) {
            greetingName = profile.displayName.trim().split(/\s+/)[0] || profile.displayName;
            const card = profile.playerCards.find((c) => c.mode === resolvedMode);
            playerOvr = card?.ovr;
        }
        const nextMatch = nextRow ? (0, games_mapper_1.mapGameToSummary)(nextRow) : null;
        return {
            greetingName,
            city: resolvedCity,
            gameMode: resolvedMode,
            playerOvr,
            nearbyGames,
            needPlayersAlerts,
            nextMatch,
            tournamentTeasers,
            feed,
            nearbyTurfs,
        };
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        games_service_1.GamesService,
        turfs_service_1.TurfsService,
        tournaments_service_1.TournamentsService])
], HomeService);
//# sourceMappingURL=home.service.js.map