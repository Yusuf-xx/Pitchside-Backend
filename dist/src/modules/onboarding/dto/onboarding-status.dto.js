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
exports.OnboardingStatusDto = exports.OnboardingSavedIdentityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class OnboardingSavedIdentityDto {
    mode;
    position;
    preferredFoot;
    skillLevel;
}
exports.OnboardingSavedIdentityDto = OnboardingSavedIdentityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], OnboardingSavedIdentityDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OnboardingSavedIdentityDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OnboardingSavedIdentityDto.prototype, "preferredFoot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OnboardingSavedIdentityDto.prototype, "skillLevel", void 0);
class OnboardingStatusDto {
    onboardingStep;
    onboardingCompleted;
    activeModes;
    primaryMode;
    displayName;
    city;
    savedGameIdentities;
    savedFormats;
}
exports.OnboardingStatusDto = OnboardingStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OnboardingStatusDto.prototype, "onboardingStep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], OnboardingStatusDto.prototype, "onboardingCompleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: game_mode_enum_1.GameMode, isArray: true }),
    __metadata("design:type", Array)
], OnboardingStatusDto.prototype, "activeModes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], OnboardingStatusDto.prototype, "primaryMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OnboardingStatusDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OnboardingStatusDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [OnboardingSavedIdentityDto],
        description: 'Saved game identities when step ≥ 2 — used to restore the form when going back.',
    }),
    __metadata("design:type", Array)
], OnboardingStatusDto.prototype, "savedGameIdentities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Saved format picks when step ≥ 3 — used to restore step 2 when going back.',
    }),
    __metadata("design:type", Array)
], OnboardingStatusDto.prototype, "savedFormats", void 0);
//# sourceMappingURL=onboarding-status.dto.js.map