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
exports.OnboardingPersonalDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
const pitchside_cities_1 = require("../../../common/pitchside-cities");
const AGE_GROUPS = ['UNDER_15', 'UNDER_18', 'UNDER_23', 'OPEN', 'VETERANS'];
class OnboardingPersonalDto {
    displayName;
    photoUrl;
    city;
    dateOfBirth;
    ageGroup;
    activeModes;
    primaryMode;
    gender;
}
exports.OnboardingPersonalDto = OnboardingPersonalDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnboardingPersonalDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnboardingPersonalDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mumbai', description: 'Must be one of the canonical PITCHSIDE city names.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(pitchside_cities_1.PITCHSIDE_CITY_NAMES_FOR_ISIN),
    __metadata("design:type", String)
], OnboardingPersonalDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2005-03-12' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OnboardingPersonalDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'UNDER_18', enum: AGE_GROUPS }),
    (0, class_validator_1.IsIn)(AGE_GROUPS),
    __metadata("design:type", String)
], OnboardingPersonalDto.prototype, "ageGroup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode, isArray: true, minItems: 1 }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsEnum)(game_mode_enum_1.GameMode, { each: true }),
    __metadata("design:type", Array)
], OnboardingPersonalDto.prototype, "activeModes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    (0, class_validator_1.IsEnum)(game_mode_enum_1.GameMode),
    __metadata("design:type", String)
], OnboardingPersonalDto.prototype, "primaryMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional — used for women-only / mixed games. Stored privately.',
        enum: ['MAN', 'WOMAN', 'NON_BINARY', 'UNSPECIFIED'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['MAN', 'WOMAN', 'NON_BINARY', 'UNSPECIFIED']),
    __metadata("design:type", String)
], OnboardingPersonalDto.prototype, "gender", void 0);
//# sourceMappingURL=onboarding-personal.dto.js.map