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
exports.GamesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const mode_city_query_dto_1 = require("../../common/dto/mode-city-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
const create_game_dto_1 = require("./dto/create-game.dto");
const complete_game_dto_1 = require("./dto/complete-game.dto");
const feedback_tag_dto_1 = require("./dto/feedback-tag.dto");
const invite_squad_dto_1 = require("./dto/invite-squad.dto");
const mark_attendance_dto_1 = require("./dto/mark-attendance.dto");
const qr_self_dto_1 = require("./dto/qr-self.dto");
const game_summary_dto_1 = require("./dto/game-summary.dto");
const match_history_dto_1 = require("./dto/match-history.dto");
const update_balanced_teams_dto_1 = require("./dto/update-balanced-teams.dto");
const games_service_1 = require("./games.service");
const recap_service_1 = require("./recap.service");
let GamesController = class GamesController {
    gamesService;
    recapService;
    constructor(gamesService, recapService) {
        this.gamesService = gamesService;
        this.recapService = recapService;
    }
    list(query) {
        return this.gamesService.list(query);
    }
    needPlayers(query) {
        return this.gamesService.needPlayers(query);
    }
    join(user, id) {
        return this.gamesService.join(id, user.userId);
    }
    leave(user, id) {
        return this.gamesService.leave(id, user.userId);
    }
    inviteSquad(user, id, dto) {
        return this.gamesService.inviteSquad(id, user.userId, dto.squadId);
    }
    shuffleTeams(user, id) {
        return this.gamesService.shuffleTeams(id, user.userId);
    }
    complete(user, id, dto) {
        return this.gamesService.completeGame(id, user.userId, dto);
    }
    feedbackTag(user, id, dto) {
        return this.gamesService.submitFeedbackTags(id, user.userId, dto);
    }
    markAttendance(user, id, dto) {
        return this.gamesService.markAttendance(id, user.userId, dto);
    }
    selfAttendance(user, id, dto) {
        return this.gamesService.selfAttendanceQr(id, user.userId, dto.token);
    }
    updateBalancedTeams(user, id, dto) {
        return this.gamesService.updateBalancedTeams(id, user.userId, dto);
    }
    myRecap(user, year, half) {
        const y = year ? Number.parseInt(year, 10) : new Date().getUTCFullYear();
        if (!Number.isFinite(y)) {
            throw new common_1.BadRequestException('Invalid year');
        }
        let h;
        if (half === '1')
            h = 1;
        else if (half === '2')
            h = 2;
        else if (half !== undefined && half !== '') {
            throw new common_1.BadRequestException('half must be 1 or 2');
        }
        return this.recapService.getOrBuildRecap(user.userId, y, h);
    }
    matchHistory(userId, query) {
        return this.gamesService.getMatchHistory(userId, query);
    }
    getById(id, req) {
        return this.gamesService.getById(id, req.user?.userId);
    }
    create(user, dto) {
        return this.gamesService.create(dto, user.userId);
    }
};
exports.GamesController = GamesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List upcoming public games (mode + city filters)' }),
    (0, swagger_1.ApiOkResponse)({ type: game_summary_dto_1.GameSummaryDto, isArray: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mode_city_query_dto_1.ModeCityQueryDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('alerts/need-players'),
    (0, swagger_1.ApiOperation)({ summary: 'Urgent last-spot requests' }),
    (0, swagger_1.ApiOkResponse)({ type: game_summary_dto_1.GameSummaryDto, isArray: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mode_city_query_dto_1.ModeCityQueryDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "needPlayers", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Join a public upcoming game' }),
    (0, swagger_1.ApiOkResponse)({ type: game_summary_dto_1.GameSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "join", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Leave a game you joined (host cannot leave)' }),
    (0, swagger_1.ApiOkResponse)({ type: game_summary_dto_1.GameSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "leave", null);
__decorate([
    (0, common_1.Post)(':id/invite-squad'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Host invites a squad — all members notified' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, invite_squad_dto_1.InviteSquadDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "inviteSquad", null);
__decorate([
    (0, common_1.Post)(':id/shuffle-teams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Host re-runs auto-balanced A/B split' }),
    (0, swagger_1.ApiOkResponse)({ type: game_summary_dto_1.GameSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "shuffleTeams", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Host marks game complete and records winner for rivalries' }),
    (0, swagger_1.ApiOkResponse)({ type: game_summary_dto_1.GameSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complete_game_dto_1.CompleteGameDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/feedback-tags'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Post-match teammate tag (after game completed)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, feedback_tag_dto_1.FeedbackTagDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "feedbackTag", null);
__decorate([
    (0, common_1.Patch)(':id/attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Host marks attendance for players' }),
    (0, swagger_1.ApiOkResponse)({ type: game_summary_dto_1.GameSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, mark_attendance_dto_1.MarkAttendanceDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "markAttendance", null);
__decorate([
    (0, common_1.Post)(':id/attendance/self'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Player self check-in with QR token from host screen' }),
    (0, swagger_1.ApiOkResponse)({ type: game_summary_dto_1.GameSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, qr_self_dto_1.QrSelfAttendanceDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "selfAttendance", null);
__decorate([
    (0, common_1.Patch)(':id/teams/balanced'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Host manually assigns balanced teams (drag-drop in UI)' }),
    (0, swagger_1.ApiOkResponse)({ type: game_summary_dto_1.GameSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_balanced_teams_dto_1.UpdateBalancedTeamsDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "updateBalancedTeams", null);
__decorate([
    (0, common_1.Get)('recap/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Annual football-style recap (cached per calendar year)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'periodKey + payload stats' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('half')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "myRecap", null);
__decorate([
    (0, common_1.Get)('match-history/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Public match history for a player profile' }),
    (0, swagger_1.ApiOkResponse)({ type: match_history_dto_1.MatchHistoryResponseDto }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, match_history_dto_1.MatchHistoryQueryDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "matchHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Game detail',
        description: 'Bearer optional — when logged in, includes isHost / isParticipant. Private games only visible to host or participants.',
    }),
    (0, swagger_1.ApiOkResponse)({ type: game_summary_dto_1.GameSummaryDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a public game (host auto-joins)' }),
    (0, swagger_1.ApiCreatedResponse)({ type: game_summary_dto_1.GameSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_game_dto_1.CreateGameDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "create", null);
exports.GamesController = GamesController = __decorate([
    (0, swagger_1.ApiTags)('Games'),
    (0, common_1.Controller)('games'),
    __metadata("design:paramtypes", [games_service_1.GamesService,
        recap_service_1.RecapService])
], GamesController);
//# sourceMappingURL=games.controller.js.map