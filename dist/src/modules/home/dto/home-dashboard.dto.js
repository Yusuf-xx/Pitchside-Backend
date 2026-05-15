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
exports.HomeDashboardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
const game_summary_dto_1 = require("../../games/dto/game-summary.dto");
const turf_summary_dto_1 = require("../../turfs/dto/turf-summary.dto");
const home_feed_dto_1 = require("./home-feed.dto");
class HomeDashboardDto {
    greetingName;
    city;
    gameMode;
    playerOvr;
    nearbyGames;
    needPlayersAlerts;
    nextMatch;
    tournamentTeasers;
    feed;
    nearbyTurfs;
}
exports.HomeDashboardDto = HomeDashboardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name or "Player" for guests' }),
    __metadata("design:type", String)
], HomeDashboardDto.prototype, "greetingName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], HomeDashboardDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode, description: 'Active filter for this payload' }),
    __metadata("design:type", String)
], HomeDashboardDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Signed-in user primary OVR for active mode (if card exists)' }),
    __metadata("design:type", Number)
], HomeDashboardDto.prototype, "playerOvr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [game_summary_dto_1.GameSummaryDto] }),
    __metadata("design:type", Array)
], HomeDashboardDto.prototype, "nearbyGames", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [game_summary_dto_1.GameSummaryDto] }),
    __metadata("design:type", Array)
], HomeDashboardDto.prototype, "needPlayersAlerts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: game_summary_dto_1.GameSummaryDto, nullable: true }),
    __metadata("design:type", Object)
], HomeDashboardDto.prototype, "nextMatch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [home_feed_dto_1.TournamentTeaserDto] }),
    __metadata("design:type", Array)
], HomeDashboardDto.prototype, "tournamentTeasers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [home_feed_dto_1.FeedItemDto] }),
    __metadata("design:type", Array)
], HomeDashboardDto.prototype, "feed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [turf_summary_dto_1.TurfSummaryDto] }),
    __metadata("design:type", Array)
], HomeDashboardDto.prototype, "nearbyTurfs", void 0);
//# sourceMappingURL=home-dashboard.dto.js.map