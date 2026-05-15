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
exports.GameRecordPeerSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GameRecordPeerSummaryDto {
    userId;
    displayName;
    avgSkill;
    avgEffort;
    avgAttitude;
    avgCommunication;
    ratingCount;
    ratedByMe;
}
exports.GameRecordPeerSummaryDto = GameRecordPeerSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameRecordPeerSummaryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameRecordPeerSummaryDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], GameRecordPeerSummaryDto.prototype, "avgSkill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], GameRecordPeerSummaryDto.prototype, "avgEffort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], GameRecordPeerSummaryDto.prototype, "avgAttitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], GameRecordPeerSummaryDto.prototype, "avgCommunication", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ratings received in this game (no-shows excluded from averages)' }),
    __metadata("design:type", Number)
], GameRecordPeerSummaryDto.prototype, "ratingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the current viewer already submitted a row for this teammate' }),
    __metadata("design:type", Boolean)
], GameRecordPeerSummaryDto.prototype, "ratedByMe", void 0);
//# sourceMappingURL=game-record-peer-summary.dto.js.map