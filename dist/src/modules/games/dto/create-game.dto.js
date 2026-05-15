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
exports.CreateGameDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
const GENDER_FORMATS = ['OPEN', 'WOMEN_ONLY', 'MIXED'];
const FOOTBALL_VENUE_SUB = ['CAGE', 'ROOFTOP', 'BEACH', 'STREET_GULLY', 'BOX'];
class CreateGameDto {
    gameMode;
    title;
    venueName;
    city;
    startsAt;
    maxPlayers;
    minPlayersToConfirm;
    confirmDeadlineAt;
    genderFormat;
    mixedMinWomenOnField;
    footballVenueSubFormat;
    skillLevel;
    isPublic;
    priceInrPerPlayer;
}
exports.CreateGameDto = CreateGameDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    (0, class_validator_1.IsEnum)(game_mode_enum_1.GameMode),
    __metadata("design:type", String)
], CreateGameDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5v5 Futsal — GoalZone Bandra' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateGameDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateGameDto.prototype, "venueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mumbai' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateGameDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-12T20:00:00+05:30' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateGameDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], CreateGameDto.prototype, "maxPlayers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum joined players required to confirm the game (defaults to maxPlayers)',
        example: 8,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], CreateGameDto.prototype, "minPlayersToConfirm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'If set, OPEN games with fewer than minPlayersToConfirm at this time auto-cancel',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateGameDto.prototype, "confirmDeadlineAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: GENDER_FORMATS, default: 'OPEN' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([...GENDER_FORMATS]),
    __metadata("design:type", Object)
], CreateGameDto.prototype, "genderFormat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'For MIXED format — minimum women on field (enforced in future balancing)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(11),
    __metadata("design:type", Number)
], CreateGameDto.prototype, "mixedMinWomenOnField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: FOOTBALL_VENUE_SUB }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([...FOOTBALL_VENUE_SUB]),
    __metadata("design:type", Object)
], CreateGameDto.prototype, "footballVenueSubFormat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'INTERMEDIATE' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], CreateGameDto.prototype, "skillLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateGameDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateGameDto.prototype, "priceInrPerPlayer", void 0);
//# sourceMappingURL=create-game.dto.js.map