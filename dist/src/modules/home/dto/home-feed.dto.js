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
exports.FeedItemDto = exports.TournamentTeaserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class TournamentTeaserDto {
    id;
    name;
    gameMode;
    city;
    startsAt;
    entryFeeInr;
    prizeInr;
    teamsRegistered;
    teamsCap;
    format;
}
exports.TournamentTeaserDto = TournamentTeaserDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TournamentTeaserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TournamentTeaserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], TournamentTeaserDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TournamentTeaserDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TournamentTeaserDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TournamentTeaserDto.prototype, "entryFeeInr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TournamentTeaserDto.prototype, "prizeInr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TournamentTeaserDto.prototype, "teamsRegistered", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TournamentTeaserDto.prototype, "teamsCap", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TournamentTeaserDto.prototype, "format", void 0);
class FeedItemDto {
    id;
    type;
    title;
    body;
    gameMode;
    createdAt;
}
exports.FeedItemDto = FeedItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeedItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeedItemDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeedItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeedItemDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], FeedItemDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeedItemDto.prototype, "createdAt", void 0);
//# sourceMappingURL=home-feed.dto.js.map