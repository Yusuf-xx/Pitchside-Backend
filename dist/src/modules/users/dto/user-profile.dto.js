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
exports.UserProfileDto = exports.FeedbackTagCountDto = exports.RivalBriefDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class RivalBriefDto {
    opponentUserId;
    opponentDisplayName;
    myWins;
    myLosses;
    draws;
    lastPlayedAt;
}
exports.RivalBriefDto = RivalBriefDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RivalBriefDto.prototype, "opponentUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RivalBriefDto.prototype, "opponentDisplayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Wins for you' }),
    __metadata("design:type", Number)
], RivalBriefDto.prototype, "myWins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RivalBriefDto.prototype, "myLosses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RivalBriefDto.prototype, "draws", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], RivalBriefDto.prototype, "lastPlayedAt", void 0);
class FeedbackTagCountDto {
    tagKey;
    count;
}
exports.FeedbackTagCountDto = FeedbackTagCountDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeedbackTagCountDto.prototype, "tagKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FeedbackTagCountDto.prototype, "count", void 0);
class UserProfileDto {
    userId;
    email;
    displayName;
    city;
    activeModes;
    primaryMode;
    onboardingStep;
    onboardingCompleted;
    photoUrl;
    dateOfBirth;
    ageGroup;
    gender;
    showWomenOnlyGames;
    reliabilityPct;
    profileAttendanceWarning;
    verifiedHost;
    topPositiveTags;
    topRivals;
    privateNegativeTags;
    joinRestrictedUntil;
    phoneOnFile;
}
exports.UserProfileDto = UserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserProfileDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserProfileDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserProfileDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode, isArray: true }),
    __metadata("design:type", Array)
], UserProfileDto.prototype, "activeModes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "primaryMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "onboardingStep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "onboardingCompleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserProfileDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserProfileDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserProfileDto.prototype, "ageGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Only on /users/me when set' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Only on /users/me' }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "showWomenOnlyGames", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '0–100, games attended ÷ games confirmed' }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "reliabilityPct", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Yellow caution when 2+ no-shows in 30d' }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "profileAttendanceWarning", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Host 5+ confirmed games' }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "verifiedHost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [FeedbackTagCountDto] }),
    __metadata("design:type", Array)
], UserProfileDto.prototype, "topPositiveTags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [RivalBriefDto], description: 'Up to 3 auto rivalries' }),
    __metadata("design:type", Array)
], UserProfileDto.prototype, "topRivals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [FeedbackTagCountDto], description: 'Only on /users/me — private negative tag counts' }),
    __metadata("design:type", Array)
], UserProfileDto.prototype, "privateNegativeTags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Only on /users/me — ISO instant when join restriction lifts' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "joinRestrictedUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Only on /users/me — true when a phone is saved for friend lookup' }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "phoneOnFile", void 0);
//# sourceMappingURL=user-profile.dto.js.map