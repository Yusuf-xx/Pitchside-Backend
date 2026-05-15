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
exports.GameRecordReceivedSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GameRecordReceivedSummaryDto {
    avgSkill;
    avgEffort;
    avgAttitude;
    avgCommunication;
    ratingCount;
}
exports.GameRecordReceivedSummaryDto = GameRecordReceivedSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true, description: 'Average skill (1–5), excluding no-shows' }),
    __metadata("design:type", Object)
], GameRecordReceivedSummaryDto.prototype, "avgSkill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], GameRecordReceivedSummaryDto.prototype, "avgEffort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], GameRecordReceivedSummaryDto.prototype, "avgAttitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], GameRecordReceivedSummaryDto.prototype, "avgCommunication", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of teammate ratings received (no-show excluded from averages)' }),
    __metadata("design:type", Number)
], GameRecordReceivedSummaryDto.prototype, "ratingCount", void 0);
//# sourceMappingURL=game-record-received-summary.dto.js.map