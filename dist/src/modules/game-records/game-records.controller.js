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
exports.GameRecordsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const game_record_response_dto_1 = require("./dto/game-record-response.dto");
const submit_ratings_dto_1 = require("./dto/submit-ratings.dto");
const game_records_service_1 = require("./game-records.service");
let GameRecordsController = class GameRecordsController {
    gameRecordsService;
    constructor(gameRecordsService) {
        this.gameRecordsService = gameRecordsService;
    }
    getByGame(gameId, user) {
        return this.gameRecordsService.getByGame(gameId, user.userId);
    }
    submitRatings(gameId, user, dto) {
        return this.gameRecordsService.submitRatings(gameId, user.userId, dto.ratings);
    }
};
exports.GameRecordsController = GameRecordsController;
__decorate([
    (0, common_1.Get)(':gameId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Post-match record for a game',
        description: 'Participants only. Includes roster, your submitted rows, anonymised averages per teammate, and how others rated you (aggregated). Ratings are accepted after the scheduled kickoff time.',
    }),
    (0, swagger_1.ApiOkResponse)({ type: game_record_response_dto_1.GameRecordResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Game not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Not a participant' }),
    __param(0, (0, common_1.Param)('gameId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GameRecordsController.prototype, "getByGame", null);
__decorate([
    (0, common_1.Post)(':gameId/ratings'),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit or update teammate ratings',
        description: 'Upserts one row per teammate. Only participants; cannot rate yourself. Opens after game kickoff (startsAt).',
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: game_record_response_dto_1.GameRecordResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)(),
    (0, swagger_1.ApiForbiddenResponse)(),
    __param(0, (0, common_1.Param)('gameId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, submit_ratings_dto_1.SubmitRatingsDto]),
    __metadata("design:returntype", Promise)
], GameRecordsController.prototype, "submitRatings", null);
exports.GameRecordsController = GameRecordsController = __decorate([
    (0, swagger_1.ApiTags)('Game Records'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('game-records'),
    __metadata("design:paramtypes", [game_records_service_1.GameRecordsService])
], GameRecordsController);
//# sourceMappingURL=game-records.controller.js.map