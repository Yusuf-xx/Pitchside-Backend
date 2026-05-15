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
exports.PlayerCardDto = exports.PlayerCardStatDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class PlayerCardStatDto {
    key;
    value;
}
exports.PlayerCardStatDto = PlayerCardStatDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PAC' }),
    __metadata("design:type", String)
], PlayerCardStatDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 82 }),
    __metadata("design:type", Number)
], PlayerCardStatDto.prototype, "value", void 0);
class PlayerCardDto {
    userId;
    displayName;
    mode;
    ovr;
    position;
    skillLevel;
    preferredFoot;
    city;
    stats;
    reputationTier;
    rarity;
    badges;
    reliabilityPct;
}
exports.PlayerCardDto = PlayerCardDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlayerCardDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlayerCardDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], PlayerCardDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 78 }),
    __metadata("design:type", Number)
], PlayerCardDto.prototype, "ovr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlayerCardDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ADVANCED' }),
    __metadata("design:type", String)
], PlayerCardDto.prototype, "skillLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'LEFT' }),
    __metadata("design:type", String)
], PlayerCardDto.prototype, "preferredFoot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlayerCardDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PlayerCardStatDto] }),
    __metadata("design:type", Array)
], PlayerCardDto.prototype, "stats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlayerCardDto.prototype, "reputationTier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PlayerCardDto.prototype, "rarity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Achievement / badge keys' }),
    __metadata("design:type", Array)
], PlayerCardDto.prototype, "badges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Games attended ÷ games confirmed × 100' }),
    __metadata("design:type", Number)
], PlayerCardDto.prototype, "reliabilityPct", void 0);
//# sourceMappingURL=player-card.dto.js.map