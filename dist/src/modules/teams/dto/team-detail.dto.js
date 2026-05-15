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
exports.TeamDetailDto = exports.TeamRosterMemberDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const team_summary_dto_1 = require("./team-summary.dto");
class TeamRosterMemberDto {
    userId;
    displayName;
    role;
    ovr;
}
exports.TeamRosterMemberDto = TeamRosterMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamRosterMemberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamRosterMemberDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'CAPTAIN | MEMBER' }),
    __metadata("design:type", String)
], TeamRosterMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Player card OVR for the team game mode, if available' }),
    __metadata("design:type", Number)
], TeamRosterMemberDto.prototype, "ovr", void 0);
class TeamDetailDto extends team_summary_dto_1.TeamSummaryDto {
    members;
    isCaptain;
}
exports.TeamDetailDto = TeamDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TeamRosterMemberDto] }),
    __metadata("design:type", Array)
], TeamDetailDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'True when the bearer is the squad captain' }),
    __metadata("design:type", Boolean)
], TeamDetailDto.prototype, "isCaptain", void 0);
//# sourceMappingURL=team-detail.dto.js.map