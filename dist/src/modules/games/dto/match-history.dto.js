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
exports.MatchHistoryResponseDto = exports.MatchHistorySummaryDto = exports.MatchHistoryRowDto = exports.MatchHistoryQueryDto = exports.MatchHistoryStatLineDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class MatchHistoryStatLineDto {
    goals;
    assists;
    wickets;
}
exports.MatchHistoryStatLineDto = MatchHistoryStatLineDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], MatchHistoryStatLineDto.prototype, "goals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], MatchHistoryStatLineDto.prototype, "assists", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], MatchHistoryStatLineDto.prototype, "wickets", void 0);
class MatchHistoryQueryDto {
    gameMode;
    month;
}
exports.MatchHistoryQueryDto = MatchHistoryQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: game_mode_enum_1.GameMode }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(game_mode_enum_1.GameMode),
    __metadata("design:type", String)
], MatchHistoryQueryDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-05', description: 'YYYY-MM filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}$/),
    __metadata("design:type", String)
], MatchHistoryQueryDto.prototype, "month", void 0);
class MatchHistoryRowDto {
    gameId;
    gameMode;
    venueName;
    city;
    startsAt;
    formatLabel;
    result;
    attendanceStatus;
    tagsReceived;
    statLine;
}
exports.MatchHistoryRowDto = MatchHistoryRowDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchHistoryRowDto.prototype, "gameId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], MatchHistoryRowDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchHistoryRowDto.prototype, "venueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchHistoryRowDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchHistoryRowDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], MatchHistoryRowDto.prototype, "formatLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'WIN | LOSS | DRAW | N_A' }),
    __metadata("design:type", String)
], MatchHistoryRowDto.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ATTENDED | NO_SHOW | CANCELLED | PENDING' }),
    __metadata("design:type", String)
], MatchHistoryRowDto.prototype, "attendanceStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Positive tags received this match' }),
    __metadata("design:type", Array)
], MatchHistoryRowDto.prototype, "tagsReceived", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: MatchHistoryStatLineDto, description: 'Host-entered stats at game completion' }),
    __metadata("design:type", MatchHistoryStatLineDto)
], MatchHistoryRowDto.prototype, "statLine", void 0);
class MatchHistorySummaryDto {
    gamesPlayed;
    attendanceRatePct;
    wins;
    losses;
    draws;
}
exports.MatchHistorySummaryDto = MatchHistorySummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MatchHistorySummaryDto.prototype, "gamesPlayed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '0–100' }),
    __metadata("design:type", Number)
], MatchHistorySummaryDto.prototype, "attendanceRatePct", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MatchHistorySummaryDto.prototype, "wins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MatchHistorySummaryDto.prototype, "losses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MatchHistorySummaryDto.prototype, "draws", void 0);
class MatchHistoryResponseDto {
    summary;
    rows;
}
exports.MatchHistoryResponseDto = MatchHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: MatchHistorySummaryDto }),
    __metadata("design:type", MatchHistorySummaryDto)
], MatchHistoryResponseDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MatchHistoryRowDto] }),
    __metadata("design:type", Array)
], MatchHistoryResponseDto.prototype, "rows", void 0);
//# sourceMappingURL=match-history.dto.js.map