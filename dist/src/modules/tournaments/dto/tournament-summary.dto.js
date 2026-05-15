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
exports.TournamentSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class TournamentSummaryDto {
    id;
    name;
    gameMode;
    format;
    city;
    startsAt;
    entryFeeInr;
    prizeInr;
    teamsRegistered;
    teamsCap;
    bannerImageUrl;
    genderFormat;
}
exports.TournamentSummaryDto = TournamentSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TournamentSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TournamentSummaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], TournamentSummaryDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TournamentSummaryDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TournamentSummaryDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ISO 8601 start time' }),
    __metadata("design:type", String)
], TournamentSummaryDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TournamentSummaryDto.prototype, "entryFeeInr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TournamentSummaryDto.prototype, "prizeInr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TournamentSummaryDto.prototype, "teamsRegistered", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TournamentSummaryDto.prototype, "teamsCap", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TournamentSummaryDto.prototype, "bannerImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'OPEN | WOMEN_ONLY | MIXED' }),
    __metadata("design:type", String)
], TournamentSummaryDto.prototype, "genderFormat", void 0);
//# sourceMappingURL=tournament-summary.dto.js.map