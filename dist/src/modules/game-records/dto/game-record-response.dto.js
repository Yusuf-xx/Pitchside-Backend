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
exports.GameRecordResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
const game_record_phase_enum_1 = require("../../../common/enums/game-record-phase.enum");
const game_record_my_rating_dto_1 = require("./game-record-my-rating.dto");
const game_record_participant_dto_1 = require("./game-record-participant.dto");
const game_record_peer_summary_dto_1 = require("./game-record-peer-summary.dto");
const game_record_received_summary_dto_1 = require("./game-record-received-summary.dto");
class GameRecordResponseDto {
    gameId;
    gameMode;
    title;
    venueName;
    city;
    startsAt;
    phase;
    participants;
    myRatings;
    peerSummaries;
    receivedSummary;
}
exports.GameRecordResponseDto = GameRecordResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameRecordResponseDto.prototype, "gameId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], GameRecordResponseDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameRecordResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameRecordResponseDto.prototype, "venueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameRecordResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameRecordResponseDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_record_phase_enum_1.GameRecordPhase }),
    __metadata("design:type", String)
], GameRecordResponseDto.prototype, "phase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [game_record_participant_dto_1.GameRecordParticipantDto] }),
    __metadata("design:type", Array)
], GameRecordResponseDto.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [game_record_my_rating_dto_1.GameRecordMyRatingDto] }),
    __metadata("design:type", Array)
], GameRecordResponseDto.prototype, "myRatings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [game_record_peer_summary_dto_1.GameRecordPeerSummaryDto] }),
    __metadata("design:type", Array)
], GameRecordResponseDto.prototype, "peerSummaries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: game_record_received_summary_dto_1.GameRecordReceivedSummaryDto,
        nullable: true,
        description: 'How teammates rated you (aggregated)',
    }),
    __metadata("design:type", Object)
], GameRecordResponseDto.prototype, "receivedSummary", void 0);
//# sourceMappingURL=game-record-response.dto.js.map