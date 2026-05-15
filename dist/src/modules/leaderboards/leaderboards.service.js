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
exports.LeaderboardsService = void 0;
const common_1 = require("@nestjs/common");
const city_normalize_util_1 = require("../../common/city-normalize.util");
const prisma_service_1 = require("../../prisma/prisma.service");
const EXCLUDED_CITY = new Set(['', 'TBD']);
let LeaderboardsService = class LeaderboardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async city(city, mode) {
        const normalized = city.trim();
        if (!normalized || EXCLUDED_CITY.has(normalized)) {
            throw new common_1.BadRequestException('Provide a valid city (not TBD).');
        }
        const cards = await this.prisma.playerCard.findMany({
            where: {
                mode,
                profile: {
                    city: (0, city_normalize_util_1.prismaCityEqualsInsensitive)(normalized),
                },
            },
            orderBy: [{ ovr: 'desc' }],
            take: 100,
            include: { profile: true },
        });
        return cards.map((row, index) => ({
            rank: index + 1,
            userId: row.profile.userId,
            displayName: row.profile.displayName,
            city: row.profile.city,
            ovr: row.ovr,
        }));
    }
    async national(mode) {
        const cards = await this.prisma.playerCard.findMany({
            where: {
                mode,
                profile: {
                    city: { notIn: ['TBD', ''] },
                },
            },
            orderBy: [{ ovr: 'desc' }],
            take: 100,
            include: { profile: true },
        });
        return cards.map((row, index) => ({
            rank: index + 1,
            userId: row.profile.userId,
            displayName: row.profile.displayName,
            city: row.profile.city,
            ovr: row.ovr,
        }));
    }
};
exports.LeaderboardsService = LeaderboardsService;
exports.LeaderboardsService = LeaderboardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaderboardsService);
//# sourceMappingURL=leaderboards.service.js.map