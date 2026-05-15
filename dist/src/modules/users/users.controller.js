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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const join_restriction_appeal_dto_1 = require("./dto/join-restriction-appeal.dto");
const player_search_result_dto_1 = require("./dto/player-search-result.dto");
const update_home_mode_dto_1 = require("./dto/update-home-mode.dto");
const update_profile_contact_dto_1 = require("./dto/update-profile-contact.dto");
const update_profile_privacy_dto_1 = require("./dto/update-profile-privacy.dto");
const update_user_preferences_dto_1 = require("./dto/update-user-preferences.dto");
const user_profile_dto_1 = require("./dto/user-profile.dto");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getMe(user) {
        return this.usersService.getMe(user.userId);
    }
    updatePreferences(user, dto) {
        return this.usersService.updatePreferences(user.userId, dto);
    }
    updateHomeMode(user, dto) {
        return this.usersService.updateHomeMode(user.userId, dto);
    }
    updateProfilePrivacy(user, dto) {
        return this.usersService.updateProfilePrivacy(user.userId, dto);
    }
    submitAppeal(user, dto) {
        return this.usersService.submitJoinRestrictionAppeal(user.userId, dto);
    }
    search(user, q) {
        return this.usersService.searchPlayers(user.userId, q ?? '');
    }
    updateContact(user, dto) {
        return this.usersService.updateProfileContact(user.userId, dto);
    }
    getById(id) {
        return this.usersService.getById(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Current user profile' }),
    (0, swagger_1.ApiOkResponse)({ type: user_profile_dto_1.UserProfileDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('me/preferences'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Update game modes and city' }),
    (0, swagger_1.ApiOkResponse)({ type: user_profile_dto_1.UserProfileDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_preferences_dto_1.UpdateUserPreferencesDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Patch)('me/home-mode'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Persist global home/game feed mode (must be in activeModes)' }),
    (0, swagger_1.ApiOkResponse)({ type: user_profile_dto_1.UserProfileDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_home_mode_dto_1.UpdateHomeModeDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateHomeMode", null);
__decorate([
    (0, common_1.Patch)('me/profile-privacy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Gender + women-only discovery toggle (private by default)' }),
    (0, swagger_1.ApiOkResponse)({ type: user_profile_dto_1.UserProfileDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_privacy_dto_1.UpdateProfilePrivacyDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfilePrivacy", null);
__decorate([
    (0, common_1.Post)('me/join-restriction-appeal'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Appeal a temporary join restriction (no-show policy)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, join_restriction_appeal_dto_1.JoinRestrictionAppealDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "submitAppeal", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Search players by display name, user id, or registered phone (for squads)' }),
    (0, swagger_1.ApiOkResponse)({ type: player_search_result_dto_1.PlayerSearchResultDto, isArray: true }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "search", null);
__decorate([
    (0, common_1.Patch)('me/contact'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Optional E.164 phone so friends can find you by number' }),
    (0, swagger_1.ApiOkResponse)({ type: user_profile_dto_1.UserProfileDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_contact_dto_1.UpdateProfileContactDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Public profile by user id' }),
    (0, swagger_1.ApiOkResponse)({ type: user_profile_dto_1.UserProfileDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getById", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map