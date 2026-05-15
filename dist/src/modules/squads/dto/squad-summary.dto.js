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
exports.SquadSummaryDto = exports.SquadMemberDto = exports.SquadStatsDto = exports.SquadGameTeaserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SquadGameTeaserDto {
    id;
    title;
    city;
    venueName;
    startsAt;
    lifecycleState;
}
exports.SquadGameTeaserDto = SquadGameTeaserDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadGameTeaserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadGameTeaserDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadGameTeaserDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadGameTeaserDto.prototype, "venueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadGameTeaserDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadGameTeaserDto.prototype, "lifecycleState", void 0);
class SquadStatsDto {
    gamesTogether;
    winRatePctApprox;
    mostActiveMemberUserId;
    mostActiveMemberDisplayName;
    mostActiveMemberPhotoUrl;
    mostActiveMemberGames;
}
exports.SquadStatsDto = SquadStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Completed games with 2+ squad members together' }),
    __metadata("design:type", Number)
], SquadStatsDto.prototype, "gamesTogether", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approximate squad win rate when enough data' }),
    __metadata("design:type", Number)
], SquadStatsDto.prototype, "winRatePctApprox", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SquadStatsDto.prototype, "mostActiveMemberUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SquadStatsDto.prototype, "mostActiveMemberDisplayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Avatar of most active member when available' }),
    __metadata("design:type", String)
], SquadStatsDto.prototype, "mostActiveMemberPhotoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SquadStatsDto.prototype, "mostActiveMemberGames", void 0);
class SquadMemberDto {
    userId;
    displayName;
    invitedPhone;
}
exports.SquadMemberDto = SquadMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadMemberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadMemberDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SquadMemberDto.prototype, "invitedPhone", void 0);
class SquadSummaryDto {
    id;
    name;
    city;
    captainUserId;
    memberCount;
    members;
    upcomingGames;
    pastGamesTogether;
    stats;
}
exports.SquadSummaryDto = SquadSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadSummaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadSummaryDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SquadSummaryDto.prototype, "captainUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SquadSummaryDto.prototype, "memberCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SquadMemberDto] }),
    __metadata("design:type", Array)
], SquadSummaryDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [SquadGameTeaserDto] }),
    __metadata("design:type", Array)
], SquadSummaryDto.prototype, "upcomingGames", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [SquadGameTeaserDto] }),
    __metadata("design:type", Array)
], SquadSummaryDto.prototype, "pastGamesTogether", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SquadStatsDto }),
    __metadata("design:type", SquadStatsDto)
], SquadSummaryDto.prototype, "stats", void 0);
//# sourceMappingURL=squad-summary.dto.js.map