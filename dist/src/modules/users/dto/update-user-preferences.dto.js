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
exports.UpdateUserPreferencesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
const pitchside_cities_1 = require("../../../common/pitchside-cities");
class UpdateUserPreferencesDto {
    activeModes;
    city;
    primaryMode;
}
exports.UpdateUserPreferencesDto = UpdateUserPreferencesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode, isArray: true, example: [game_mode_enum_1.GameMode.FOOTBALL, game_mode_enum_1.GameMode.CRICKET] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(game_mode_enum_1.GameMode, { each: true }),
    __metadata("design:type", Array)
], UpdateUserPreferencesDto.prototype, "activeModes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bengaluru', description: 'Must be one of the canonical PITCHSIDE city names.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(pitchside_cities_1.PITCHSIDE_CITY_NAMES_FOR_ISIN),
    __metadata("design:type", String)
], UpdateUserPreferencesDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: game_mode_enum_1.GameMode, description: 'Primary filter for home feed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(game_mode_enum_1.GameMode),
    __metadata("design:type", String)
], UpdateUserPreferencesDto.prototype, "primaryMode", void 0);
//# sourceMappingURL=update-user-preferences.dto.js.map