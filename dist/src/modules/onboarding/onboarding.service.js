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
exports.OnboardingService = void 0;
const common_1 = require("@nestjs/common");
const dob_profile_util_1 = require("../../common/dob-profile.util");
const pitchside_cities_1 = require("../../common/pitchside-cities");
const game_mode_enum_1 = require("../../common/enums/game-mode.enum");
const prisma_service_1 = require("../../prisma/prisma.service");
const onboarding_card_builder_1 = require("./onboarding-card.builder");
let OnboardingService = class OnboardingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStatus(userId) {
        const profile = await this.requireProfile(userId, { identities: true });
        return this.toStatus(profile);
    }
    async savePersonal(userId, dto) {
        if (!dto.activeModes.includes(dto.primaryMode)) {
            throw new common_1.BadRequestException('primaryMode must be included in activeModes');
        }
        const profile = await this.requireProfile(userId);
        const trimmedCity = dto.city.trim();
        if (!(0, pitchside_cities_1.isPitchsideCityName)(trimmedCity)) {
            throw new common_1.BadRequestException('Choose a supported city from the list.');
        }
        const dobErr = (0, dob_profile_util_1.validateProfileDobYmd)(dto.dateOfBirth);
        if (dobErr) {
            throw new common_1.BadRequestException((0, dob_profile_util_1.profileDobErrorMessage)(dobErr));
        }
        const dob = new Date(dto.dateOfBirth);
        await this.prisma.$transaction([
            this.prisma.profileMode.deleteMany({ where: { profileId: profile.id } }),
            this.prisma.profileMode.createMany({
                data: dto.activeModes.map((mode) => ({ profileId: profile.id, mode })),
            }),
            this.prisma.profile.update({
                where: { id: profile.id },
                data: {
                    displayName: dto.displayName.trim(),
                    photoUrl: dto.photoUrl?.trim() || null,
                    city: trimmedCity,
                    dateOfBirth: dob,
                    ageGroup: dto.ageGroup,
                    primaryMode: dto.primaryMode,
                    gender: dto.gender ?? null,
                    onboardingStep: Math.max(profile.onboardingStep, 1),
                },
            }),
        ]);
        return this.getStatus(userId);
    }
    async saveGameIdentity(userId, dto) {
        const profile = await this.requireProfile(userId, { identities: true });
        if (!profile.onboardingCompleted && profile.onboardingStep < 1) {
            throw new common_1.BadRequestException('Complete personal step first');
        }
        const expected = new Set(profile.profileModes.map((m) => m.mode));
        const got = new Set(dto.identities.map((i) => i.mode));
        if (expected.size !== got.size || [...expected].some((m) => !got.has(m))) {
            throw new common_1.BadRequestException('Identities must match selected modes exactly');
        }
        for (const row of dto.identities) {
            if (row.mode === game_mode_enum_1.GameMode.FOOTBALL || row.mode === game_mode_enum_1.GameMode.FUTSAL) {
                if (!row.preferredFoot?.trim()) {
                    throw new common_1.BadRequestException(`preferredFoot required for ${row.mode}`);
                }
            }
        }
        await this.prisma.modeIdentity.deleteMany({ where: { profileId: profile.id } });
        await this.prisma.modeIdentity.createMany({
            data: dto.identities.map((i) => ({
                profileId: profile.id,
                mode: i.mode,
                position: i.position.trim(),
                preferredFoot: i.preferredFoot?.trim() ?? null,
                skillLevel: i.skillLevel,
            })),
        });
        await this.prisma.profile.update({
            where: { id: profile.id },
            data: { onboardingStep: Math.max(profile.onboardingStep, 2) },
        });
        if (profile.onboardingCompleted) {
            const refreshed = await this.requireProfile(userId, { identities: true });
            await this.regeneratePlayerCards(userId, refreshed);
        }
        return this.getStatus(userId);
    }
    async saveFormats(userId, dto) {
        const profile = await this.requireProfile(userId);
        if (!profile.onboardingCompleted && profile.onboardingStep < 2) {
            throw new common_1.BadRequestException('Complete game identity step first');
        }
        await this.prisma.profile.update({
            where: { id: profile.id },
            data: {
                preferredFormatsJson: JSON.stringify(dto.formats),
                onboardingStep: Math.max(profile.onboardingStep, 3),
            },
        });
        return this.getStatus(userId);
    }
    async complete(userId) {
        const profile = await this.requireProfile(userId, { identities: true });
        if (profile.onboardingCompleted) {
            return this.toStatus(profile);
        }
        if (profile.onboardingStep < 3) {
            throw new common_1.BadRequestException('Complete formats step before finishing');
        }
        if (profile.modeIdentities.length !== profile.profileModes.length) {
            throw new common_1.BadRequestException('Missing mode identities');
        }
        await this.regeneratePlayerCards(userId, profile);
        const updated = await this.prisma.profile.update({
            where: { id: profile.id },
            data: {
                onboardingCompleted: true,
                onboardingStep: 4,
            },
            include: { profileModes: true, modeIdentities: true },
        });
        return this.toStatus(updated);
    }
    async regeneratePlayerCards(userId, profile) {
        await this.prisma.playerCard.deleteMany({ where: { profileId: profile.id } });
        for (const pm of profile.profileModes) {
            const ident = profile.modeIdentities.find((m) => m.mode === pm.mode);
            if (!ident) {
                throw new common_1.BadRequestException(`Missing identity for mode ${pm.mode}`);
            }
            const mode = pm.mode;
            const skill = ident.skillLevel;
            const ovr = (0, onboarding_card_builder_1.baseOvrFromSkill)(skill, userId);
            const rarity = (0, onboarding_card_builder_1.rarityFromSkill)(skill);
            const reputationTier = (0, onboarding_card_builder_1.reputationTierFromSkill)();
            const stats = (0, onboarding_card_builder_1.statsForMode)(mode, ovr);
            await this.prisma.playerCard.create({
                data: {
                    profileId: profile.id,
                    mode: pm.mode,
                    ovr,
                    rarity,
                    reputationTier,
                    stats: {
                        create: stats.map((s) => ({ key: s.key, value: s.value })),
                    },
                    badges: {
                        create: [
                            { badgeKey: skill },
                            ...(mode !== game_mode_enum_1.GameMode.CRICKET && ident.preferredFoot
                                ? [{ badgeKey: `${ident.preferredFoot}_FOOT` }]
                                : []),
                        ],
                    },
                },
            });
        }
    }
    async requireProfile(userId, opts) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: {
                profileModes: true,
                modeIdentities: opts?.identities ?? false,
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile;
    }
    toStatus(profile) {
        let savedFormats;
        if (profile.preferredFormatsJson) {
            try {
                const parsed = JSON.parse(profile.preferredFormatsJson);
                if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
                    savedFormats = parsed;
                }
            }
            catch {
            }
        }
        const identities = profile.modeIdentities;
        const savedGameIdentities = identities && identities.length > 0
            ? identities.map((m) => ({
                mode: m.mode,
                position: m.position,
                preferredFoot: m.preferredFoot ?? undefined,
                skillLevel: m.skillLevel,
            }))
            : undefined;
        return {
            onboardingStep: profile.onboardingStep,
            onboardingCompleted: profile.onboardingCompleted,
            displayName: profile.displayName,
            city: profile.city,
            primaryMode: profile.primaryMode,
            activeModes: profile.profileModes.length > 0
                ? profile.profileModes.map((m) => m.mode)
                : [profile.primaryMode],
            savedFormats,
            savedGameIdentities,
        };
    }
};
exports.OnboardingService = OnboardingService;
exports.OnboardingService = OnboardingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OnboardingService);
//# sourceMappingURL=onboarding.service.js.map