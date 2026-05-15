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
exports.PlayerCardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PlayerCardsService = class PlayerCardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMine(userId, mode) {
        return this.loadCard(userId, mode);
    }
    async getPublic(userId, mode) {
        return this.loadCard(userId, mode);
    }
    async loadCard(userId, mode) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: {
                    include: {
                        modeIdentities: true,
                        playerCards: {
                            include: { stats: true, badges: true },
                        },
                    },
                },
            },
        });
        if (!user?.profile) {
            throw new common_1.NotFoundException('Player not found');
        }
        const profile = user.profile;
        const resolvedMode = (mode ?? profile.primaryMode);
        const card = profile.playerCards.find((c) => c.mode === resolvedMode);
        if (!card) {
            throw new common_1.NotFoundException('Player card not available yet — finish onboarding');
        }
        const ident = profile.modeIdentities.find((m) => m.mode === resolvedMode);
        if (!ident) {
            throw new common_1.NotFoundException('Missing identity for this mode');
        }
        const confirmed = profile.gamesConfirmedCount;
        const attended = profile.gamesAttendedCount;
        const reliabilityPct = confirmed > 0 ? Math.round((Math.min(attended, confirmed) / confirmed) * 100) : 100;
        return {
            userId,
            displayName: profile.displayName,
            mode: resolvedMode,
            ovr: card.ovr,
            position: ident.position,
            skillLevel: ident.skillLevel,
            preferredFoot: ident.preferredFoot ?? undefined,
            city: profile.city,
            stats: card.stats.map((s) => ({ key: s.key, value: s.value })),
            reputationTier: card.reputationTier,
            rarity: card.rarity,
            badges: card.badges.map((b) => b.badgeKey).filter((k) => k !== 'ONBOARDED'),
            reliabilityPct,
        };
    }
};
exports.PlayerCardsService = PlayerCardsService;
exports.PlayerCardsService = PlayerCardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlayerCardsService);
//# sourceMappingURL=player-cards.service.js.map