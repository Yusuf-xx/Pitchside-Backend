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
exports.ModeCityQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const game_mode_enum_1 = require("../enums/game-mode.enum");
class ModeCityQueryDto {
    gameMode;
    city;
    womenOnly;
    footballVenueSubFormat;
}
exports.ModeCityQueryDto = ModeCityQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: game_mode_enum_1.GameMode, description: 'Active game mode filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(game_mode_enum_1.GameMode),
    __metadata("design:type", String)
], ModeCityQueryDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bengaluru' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModeCityQueryDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When true, only list women-only games' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === true || value === 'true' || value === '1'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ModeCityQueryDto.prototype, "womenOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Football venue sub-format filter (CAGE, ROOFTOP, BEACH, STREET_GULLY, BOX)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModeCityQueryDto.prototype, "footballVenueSubFormat", void 0);
//# sourceMappingURL=mode-city-query.dto.js.map