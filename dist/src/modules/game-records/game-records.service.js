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
exports.GameRecordsService = void 0;
const common_1 = require("@nestjs/common");
const game_record_phase_enum_1 = require("../../common/enums/game-record-phase.enum");
const prisma_service_1 = require("../../prisma/prisma.service");
function displayNameFor(user) {
    return user?.profile?.displayName?.trim() || 'Player';
}
function aggregateDims(rows) {
    if (rows.length === 0) {
        return {
            avgSkill: null,
            avgEffort: null,
            avgAttitude: null,
            avgCommunication: null,
            ratingCount: 0,
        };
    }
    const round1 = (v) => Math.round(v * 10) / 10;
    const mean = (key) => round1(rows.reduce((a, r) => a + r[key], 0) / rows.length);
    return {
        avgSkill: mean('skill'),
        avgEffort: mean('effort'),
        avgAttitude: mean('attitude'),
        avgCommunication: mean('communication'),
        ratingCount: rows.length,
    };
}
let GameRecordsService = class GameRecordsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getByGame(gameId, viewerUserId) {
        const game = await this.prisma.game.findUnique({
            where: { id: gameId },
            include: {
                participants: {
                    include: { user: { include: { profile: true } } },
                },
            },
        });
        if (!game) {
            throw new common_1.NotFoundException('Game not found');
        }
        const participantIds = new Set(game.participants.map((p) => p.userId));
        if (!participantIds.has(viewerUserId)) {
            throw new common_1.ForbiddenException('Only players in this game can view post-match records.');
        }
        const ratings = await this.prisma.gameTeammateRating.findMany({ where: { gameId } });
        return this.buildResponse(game, viewerUserId, ratings);
    }
    async submitRatings(gameId, viewerUserId, rows) {
        const game = await this.prisma.game.findUnique({
            where: { id: gameId },
            include: {
                participants: {
                    include: { user: { include: { profile: true } } },
                },
            },
        });
        if (!game) {
            throw new common_1.NotFoundException('Game not found');
        }
        const participantIds = new Set(game.participants.map((p) => p.userId));
        if (!participantIds.has(viewerUserId)) {
            throw new common_1.ForbiddenException('Only players in this game can submit ratings.');
        }
        const now = new Date();
        if (game.startsAt > now) {
            throw new common_1.BadRequestException('Ratings open after the scheduled kickoff time.');
        }
        const others = [...participantIds].filter((id) => id !== viewerUserId);
        if (others.length === 0) {
            throw new common_1.BadRequestException('No teammates to rate yet.');
        }
        if (rows.length === 0) {
            throw new common_1.BadRequestException('Provide at least one teammate rating.');
        }
        const subjectSet = new Set();
        for (const row of rows) {
            if (row.subjectUserId === viewerUserId) {
                throw new common_1.BadRequestException('You cannot rate yourself.');
            }
            if (!participantIds.has(row.subjectUserId)) {
                throw new common_1.BadRequestException('Invalid teammate in rating payload.');
            }
            if (subjectSet.has(row.subjectUserId)) {
                throw new common_1.BadRequestException('Duplicate teammate in payload.');
            }
            subjectSet.add(row.subjectUserId);
        }
        await this.prisma.$transaction(rows.map((row) => {
            const noShow = Boolean(row.noShow);
            const skill = noShow ? 1 : row.skill;
            const effort = noShow ? 1 : row.effort;
            const attitude = noShow ? 1 : row.attitude;
            const communication = noShow ? 1 : row.communication;
            return this.prisma.gameTeammateRating.upsert({
                where: {
                    gameId_raterUserId_subjectUserId: {
                        gameId,
                        raterUserId: viewerUserId,
                        subjectUserId: row.subjectUserId,
                    },
                },
                create: {
                    gameId,
                    raterUserId: viewerUserId,
                    subjectUserId: row.subjectUserId,
                    skill,
                    effort,
                    attitude,
                    communication,
                    noShow,
                },
                update: {
                    skill,
                    effort,
                    attitude,
                    communication,
                    noShow,
                },
            });
        }));
        const ratings = await this.prisma.gameTeammateRating.findMany({ where: { gameId } });
        return this.buildResponse(game, viewerUserId, ratings);
    }
    buildResponse(game, viewerUserId, ratings) {
        const now = new Date();
        const phase = game.startsAt > now ? game_record_phase_enum_1.GameRecordPhase.UPCOMING : game_record_phase_enum_1.GameRecordPhase.RATING_OPEN;
        const participants = game.participants.map((p) => ({
            userId: p.userId,
            displayName: displayNameFor(p.user),
        }));
        const myRatings = ratings
            .filter((r) => r.raterUserId === viewerUserId)
            .map((r) => ({
            subjectUserId: r.subjectUserId,
            skill: r.skill,
            effort: r.effort,
            attitude: r.attitude,
            communication: r.communication,
            noShow: r.noShow,
        }));
        const myRatedSubjects = new Set(myRatings.map((r) => r.subjectUserId));
        const peerSummaries = game.participants
            .filter((p) => p.userId !== viewerUserId)
            .map((p) => {
            const received = ratings.filter((r) => r.subjectUserId === p.userId && !r.noShow);
            const agg = aggregateDims(received);
            return {
                userId: p.userId,
                displayName: displayNameFor(p.user),
                avgSkill: agg.avgSkill,
                avgEffort: agg.avgEffort,
                avgAttitude: agg.avgAttitude,
                avgCommunication: agg.avgCommunication,
                ratingCount: agg.ratingCount,
                ratedByMe: myRatedSubjects.has(p.userId),
            };
        });
        const aboutMe = ratings.filter((r) => r.subjectUserId === viewerUserId && !r.noShow);
        const receivedAgg = aggregateDims(aboutMe);
        const receivedSummary = receivedAgg.ratingCount > 0
            ? {
                avgSkill: receivedAgg.avgSkill,
                avgEffort: receivedAgg.avgEffort,
                avgAttitude: receivedAgg.avgAttitude,
                avgCommunication: receivedAgg.avgCommunication,
                ratingCount: receivedAgg.ratingCount,
            }
            : null;
        return {
            gameId: game.id,
            gameMode: game.gameMode,
            title: game.title,
            venueName: game.venueName,
            city: game.city,
            startsAt: game.startsAt.toISOString(),
            phase,
            participants,
            myRatings,
            peerSummaries,
            receivedSummary,
        };
    }
};
exports.GameRecordsService = GameRecordsService;
exports.GameRecordsService = GameRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GameRecordsService);
//# sourceMappingURL=game-records.service.js.map