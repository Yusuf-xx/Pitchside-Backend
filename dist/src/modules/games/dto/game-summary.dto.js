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
exports.GameSummaryDto = exports.GameParticipantSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class GameParticipantSummaryDto {
    userId;
    displayName;
    attendanceStatus;
    teamSide;
    position;
    ovr;
    photoUrl;
}
exports.GameParticipantSummaryDto = GameParticipantSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameParticipantSummaryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameParticipantSummaryDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'PENDING | ATTENDED | NO_SHOW | CANCELLED' }),
    __metadata("design:type", String)
], GameParticipantSummaryDto.prototype, "attendanceStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'A | B when teams assigned' }),
    __metadata("design:type", Object)
], GameParticipantSummaryDto.prototype, "teamSide", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Position for this game mode (identity)' }),
    __metadata("design:type", String)
], GameParticipantSummaryDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'OVR for this game mode' }),
    __metadata("design:type", Number)
], GameParticipantSummaryDto.prototype, "ovr", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GameParticipantSummaryDto.prototype, "photoUrl", void 0);
class GameSummaryDto {
    hostUserId;
    id;
    gameMode;
    title;
    venueName;
    city;
    startsAt;
    spotsLeft;
    spotsFilled;
    spotsTotal;
    skillLevel;
    priceInrPerPlayer;
    lifecycleState;
    minPlayersToConfirm;
    confirmDeadlineAt;
    genderFormat;
    mixedMinWomenOnField;
    footballVenueSubFormat;
    formatLabel;
    hostVerified;
    balancedTeams;
    attendanceQrToken;
    urgentNeedPlayers;
    winnerSide;
    completedAt;
    beachRulesNote;
    mixedFormatRulesSummary;
    participants;
    myAttendanceStatus;
    isHost;
    isParticipant;
}
exports.GameSummaryDto = GameSummaryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Host user id (for attendance checklist filtering)' }),
    __metadata("design:type", Object)
], GameSummaryDto.prototype, "hostUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "venueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GameSummaryDto.prototype, "spotsLeft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Joined players including host' }),
    __metadata("design:type", Number)
], GameSummaryDto.prototype, "spotsFilled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GameSummaryDto.prototype, "spotsTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "skillLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GameSummaryDto.prototype, "priceInrPerPlayer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'OPEN | CONFIRMED | CANCELLED | COMPLETED' }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "lifecycleState", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Players needed to auto-confirm' }),
    __metadata("design:type", Number)
], GameSummaryDto.prototype, "minPlayersToConfirm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto-cancel unfilled OPEN games after this instant (ISO)' }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "confirmDeadlineAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'OPEN | WOMEN_ONLY | MIXED' }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "genderFormat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'For MIXED games — women per side rule' }),
    __metadata("design:type", Number)
], GameSummaryDto.prototype, "mixedMinWomenOnField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Football venue sub-format tag' }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "footballVenueSubFormat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "formatLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'True when host has hosted 5+ confirmed games' }),
    __metadata("design:type", Boolean)
], GameSummaryDto.prototype, "hostVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Balanced A/B when visible to viewer' }),
    __metadata("design:type", Object)
], GameSummaryDto.prototype, "balancedTeams", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Host-only: QR token for self check-in' }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "attendanceQrToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'True when host marked urgent / last spots' }),
    __metadata("design:type", Boolean)
], GameSummaryDto.prototype, "urgentNeedPlayers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'A | B | DRAW after completion' }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "winnerSide", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When the host marked the game completed' }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Beach football safety note' }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "beachRulesNote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mixed format rules (expandable in UI)' }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "mixedFormatRulesSummary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [GameParticipantSummaryDto], description: 'Host + joined players' }),
    __metadata("design:type", Array)
], GameSummaryDto.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Viewer attendance row when participant' }),
    __metadata("design:type", String)
], GameSummaryDto.prototype, "myAttendanceStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Present on detail when the requester is the host' }),
    __metadata("design:type", Boolean)
], GameSummaryDto.prototype, "isHost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Present on detail when the requester is a participant' }),
    __metadata("design:type", Boolean)
], GameSummaryDto.prototype, "isParticipant", void 0);
//# sourceMappingURL=game-summary.dto.js.map