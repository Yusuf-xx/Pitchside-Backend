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
exports.CompleteGameDto = exports.CompleteGameParticipantStatDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CompleteGameParticipantStatDto {
    userId;
    goals;
    assists;
    wickets;
}
exports.CompleteGameParticipantStatDto = CompleteGameParticipantStatDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteGameParticipantStatDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Football / futsal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], CompleteGameParticipantStatDto.prototype, "goals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], CompleteGameParticipantStatDto.prototype, "assists", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cricket' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], CompleteGameParticipantStatDto.prototype, "wickets", void 0);
class CompleteGameDto {
    winnerSide;
    participantStats;
}
exports.CompleteGameDto = CompleteGameDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['A', 'B', 'DRAW'] }),
    (0, class_validator_1.IsIn)(['A', 'B', 'DRAW']),
    __metadata("design:type", String)
], CompleteGameDto.prototype, "winnerSide", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [CompleteGameParticipantStatDto],
        description: 'Optional per-player stat lines stored on match history',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CompleteGameParticipantStatDto),
    __metadata("design:type", Array)
], CompleteGameDto.prototype, "participantStats", void 0);
//# sourceMappingURL=complete-game.dto.js.map