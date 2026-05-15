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
exports.TeamSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class TeamSummaryDto {
    id;
    name;
    city;
    gameMode;
    kitColorHex;
    memberCount;
    captainUserId;
    wins;
    losses;
    draws;
    teamOvr;
}
exports.TeamSummaryDto = TeamSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamSummaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamSummaryDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], TeamSummaryDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Primary kit accent hex' }),
    __metadata("design:type", String)
], TeamSummaryDto.prototype, "kitColorHex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of players in the squad roster' }),
    __metadata("design:type", Number)
], TeamSummaryDto.prototype, "memberCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamSummaryDto.prototype, "captainUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TeamSummaryDto.prototype, "wins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TeamSummaryDto.prototype, "losses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TeamSummaryDto.prototype, "draws", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average squad OVR for the team game mode (defaults when no cards)' }),
    __metadata("design:type", Number)
], TeamSummaryDto.prototype, "teamOvr", void 0);
//# sourceMappingURL=team-summary.dto.js.map