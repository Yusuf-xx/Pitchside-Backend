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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const phone_e164_util_1 = require("../../common/lib/phone-e164.util");
const pitchside_cities_1 = require("../../common/pitchside-cities");
const prisma_service_1 = require("../../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: {
                    include: { profileModes: true },
                },
            },
        });
        if (!user?.profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const base = this.mapProfileBase(user.email, user.profile);
        const [extras, neg] = await Promise.all([
            this.publicProfileExtras(userId, user.profile, user.hostedConfirmedGameCount),
            this.privateNegativeTags(userId),
        ]);
        return {
            ...base,
            ...extras,
            gender: user.profile.gender ?? undefined,
            showWomenOnlyGames: user.profile.showWomenOnlyGames,
            privateNegativeTags: neg,
            joinRestrictedUntil: user.joinRestrictedUntil?.toISOString(),
            phoneOnFile: Boolean(user.profile.phoneE164),
        };
    }
    async getById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                profile: {
                    include: { profileModes: true },
                },
            },
        });
        if (!user?.profile) {
            throw new common_1.NotFoundException('User not found');
        }
        const base = this.mapProfileBase(undefined, user.profile);
        const extras = await this.publicProfileExtras(id, user.profile, user.hostedConfirmedGameCount);
        return { ...base, ...extras };
    }
    async updateProfilePrivacy(userId, dto) {
        await this.requireProfile(userId);
        await this.prisma.profile.update({
            where: { userId },
            data: {
                ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
                ...(dto.showWomenOnlyGames !== undefined ? { showWomenOnlyGames: dto.showWomenOnlyGames } : {}),
            },
        });
        return this.getMe(userId);
    }
    async submitJoinRestrictionAppeal(userId, dto) {
        const u = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { joinRestrictedUntil: true },
        });
        if (!u?.joinRestrictedUntil || u.joinRestrictedUntil <= new Date()) {
            throw new common_1.BadRequestException('You do not have an active join restriction to appeal');
        }
        await this.prisma.attendanceRestrictionAppeal.create({
            data: {
                userId,
                message: dto.message.trim(),
            },
        });
    }
    async updatePreferences(userId, dto) {
        const profile = await this.requireProfile(userId);
        if (!dto.activeModes.includes(dto.primaryMode ?? dto.activeModes[0])) {
            throw new common_1.BadRequestException('primaryMode must be one of activeModes');
        }
        const trimmedCity = dto.city.trim();
        if (!(0, pitchside_cities_1.isPitchsideCityName)(trimmedCity)) {
            throw new common_1.BadRequestException('Choose a supported city from the list.');
        }
        const primary = dto.primaryMode ?? dto.activeModes[0];
        await this.prisma.$transaction([
            this.prisma.profileMode.deleteMany({ where: { profileId: profile.id } }),
            ...dto.activeModes.map((mode) => this.prisma.profileMode.create({
                data: { profileId: profile.id, mode },
            })),
            this.prisma.profile.update({
                where: { id: profile.id },
                data: {
                    city: trimmedCity,
                    primaryMode: primary,
                },
            }),
        ]);
        return this.getMe(userId);
    }
    async updateProfileContact(userId, dto) {
        await this.requireProfile(userId);
        const next = dto.phoneE164 === undefined
            ? undefined
            : dto.phoneE164 === null || String(dto.phoneE164).trim() === ''
                ? null
                : (0, phone_e164_util_1.normalizePhoneE164Input)(String(dto.phoneE164));
        if (dto.phoneE164 !== undefined &&
            dto.phoneE164 !== null &&
            String(dto.phoneE164).trim() !== '' &&
            !next) {
            throw new common_1.BadRequestException('phoneE164 must be valid E.164 (e.g. +919876543210)');
        }
        try {
            await this.prisma.profile.update({
                where: { userId },
                data: { phoneE164: next === undefined ? undefined : next },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('That phone is already linked to another account');
            }
            throw e;
        }
        return this.getMe(userId);
    }
    async searchPlayers(viewerUserId, q) {
        const trimmed = q.trim();
        if (trimmed.length < 2) {
            throw new common_1.BadRequestException('Type at least 2 characters to search');
        }
        const take = 25;
        const phone = (0, phone_e164_util_1.normalizePhoneE164Input)(trimmed);
        const or = [
            { displayName: { contains: trimmed, mode: 'insensitive' } },
        ];
        if (phone) {
            or.push({ phoneE164: phone });
        }
        if (trimmed.length >= 20 && /^[a-z0-9]+$/i.test(trimmed)) {
            or.push({ userId: trimmed });
        }
        const rows = await this.prisma.profile.findMany({
            where: {
                userId: { not: viewerUserId },
                onboardingCompleted: true,
                OR: or,
            },
            select: {
                userId: true,
                displayName: true,
                city: true,
                primaryMode: true,
                photoUrl: true,
            },
            take,
            orderBy: { displayName: 'asc' },
        });
        return rows.map((r) => ({
            userId: r.userId,
            displayName: r.displayName.trim(),
            city: r.city,
            primaryMode: r.primaryMode,
            photoUrl: r.photoUrl ?? undefined,
        }));
    }
    async updateHomeMode(userId, dto) {
        const profile = await this.requireProfile(userId);
        const activeModes = profile.profileModes.length > 0
            ? profile.profileModes.map((m) => m.mode)
            : [profile.primaryMode];
        if (!activeModes.includes(dto.mode)) {
            throw new common_1.BadRequestException('mode must be one of your activeModes');
        }
        await this.prisma.profile.update({
            where: { id: profile.id },
            data: { primaryMode: dto.mode },
        });
        return this.getMe(userId);
    }
    async requireProfile(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: { profileModes: true },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile;
    }
    mapProfileBase(email, profile) {
        const activeModes = profile.profileModes.length > 0
            ? profile.profileModes.map((m) => m.mode)
            : [profile.primaryMode];
        return {
            userId: profile.userId,
            email,
            displayName: profile.displayName,
            city: profile.city,
            activeModes,
            primaryMode: profile.primaryMode,
            onboardingStep: profile.onboardingStep,
            onboardingCompleted: profile.onboardingCompleted,
            photoUrl: profile.photoUrl ?? undefined,
            dateOfBirth: profile.dateOfBirth?.toISOString().slice(0, 10),
            ageGroup: profile.ageGroup,
        };
    }
    async publicProfileExtras(targetUserId, profile, hostedConfirmedGameCount) {
        const confirmed = profile.gamesConfirmedCount;
        const attended = profile.gamesAttendedCount;
        const reliabilityPct = confirmed > 0 ? Math.round((Math.min(attended, confirmed) / confirmed) * 100) : 100;
        const [posTags, rivals] = await Promise.all([
            this.prisma.teammateFeedbackTag.groupBy({
                by: ['tagKey'],
                where: { toUserId: targetUserId, isPositive: true },
                _count: { tagKey: true },
                orderBy: { _count: { tagKey: 'desc' } },
                take: 3,
            }),
            this.loadRivals(targetUserId),
        ]);
        const topPositiveTags = posTags.map((t) => ({
            tagKey: t.tagKey,
            count: t._count.tagKey,
        }));
        return {
            reliabilityPct,
            profileAttendanceWarning: profile.noShowCountLast30d >= 2,
            verifiedHost: hostedConfirmedGameCount >= 5,
            topPositiveTags,
            topRivals: rivals,
        };
    }
    async privateNegativeTags(userId) {
        const neg = await this.prisma.teammateFeedbackTag.groupBy({
            by: ['tagKey'],
            where: { toUserId: userId, isPositive: false },
            _count: { tagKey: true },
            orderBy: { _count: { tagKey: 'desc' } },
            take: 8,
        });
        return neg.map((t) => ({ tagKey: t.tagKey, count: t._count.tagKey }));
    }
    async loadRivals(userId) {
        const rows = await this.prisma.playerRivalry.findMany({
            where: {
                OR: [{ userLowId: userId }, { userHighId: userId }],
                gamesPlayed: { gte: 3 },
            },
            orderBy: { gamesPlayed: 'desc' },
            take: 3,
        });
        const out = [];
        for (const r of rows) {
            const oppId = r.userLowId === userId ? r.userHighId : r.userLowId;
            const opp = await this.prisma.profile.findUnique({
                where: { userId: oppId },
                select: { displayName: true },
            });
            const myWins = r.userLowId === userId ? r.winsForLow : r.winsForHigh;
            const myLosses = r.userLowId === userId ? r.winsForHigh : r.winsForLow;
            out.push({
                opponentUserId: oppId,
                opponentDisplayName: opp?.displayName?.trim() || 'Player',
                myWins,
                myLosses,
                draws: r.draws,
                lastPlayedAt: r.lastPlayedAt?.toISOString(),
            });
        }
        return out;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map