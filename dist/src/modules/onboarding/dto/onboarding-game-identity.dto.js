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
exports.OnboardingGameIdentityDto = exports.ModeIdentityItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE'];
class ModeIdentityItemDto {
    mode;
    position;
    preferredFoot;
    skillLevel;
}
exports.ModeIdentityItemDto = ModeIdentityItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    (0, class_validator_1.IsEnum)(game_mode_enum_1.GameMode),
    __metadata("design:type", String)
], ModeIdentityItemDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mode-specific position code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModeIdentityItemDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Required for FOOTBALL and FUTSAL' }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === game_mode_enum_1.GameMode.FOOTBALL || o.mode === game_mode_enum_1.GameMode.FUTSAL),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModeIdentityItemDto.prototype, "preferredFoot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'INTERMEDIATE' }),
    (0, class_validator_1.IsIn)(SKILL_LEVELS),
    __metadata("design:type", String)
], ModeIdentityItemDto.prototype, "skillLevel", void 0);
class OnboardingGameIdentityDto {
    identities;
}
exports.OnboardingGameIdentityDto = OnboardingGameIdentityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ModeIdentityItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ModeIdentityItemDto),
    __metadata("design:type", Array)
], OnboardingGameIdentityDto.prototype, "identities", void 0);
//# sourceMappingURL=onboarding-game-identity.dto.js.map