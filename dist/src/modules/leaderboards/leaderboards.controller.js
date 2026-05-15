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
exports.LeaderboardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leaderboard_query_dto_1 = require("./dto/leaderboard-query.dto");
const leaderboard_row_dto_1 = require("./dto/leaderboard-row.dto");
const leaderboards_service_1 = require("./leaderboards.service");
let LeaderboardsController = class LeaderboardsController {
    leaderboardsService;
    constructor(leaderboardsService) {
        this.leaderboardsService = leaderboardsService;
    }
    city(query) {
        return this.leaderboardsService.city(query.city, query.mode);
    }
    national(query) {
        return this.leaderboardsService.national(query.mode);
    }
};
exports.LeaderboardsController = LeaderboardsController;
__decorate([
    (0, common_1.Get)('city'),
    (0, swagger_1.ApiOperation)({
        summary: 'Top players in a city for a mode (from player cards)',
        description: 'Ranks by OVR for the given mode. Empty when no cards exist in that city yet.',
    }),
    (0, swagger_1.ApiOkResponse)({ type: leaderboard_row_dto_1.LeaderboardRowDto, isArray: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leaderboard_query_dto_1.CityLeaderboardQueryDto]),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "city", null);
__decorate([
    (0, common_1.Get)('national'),
    (0, swagger_1.ApiOperation)({
        summary: 'National top players for a mode',
        description: 'Excludes placeholder cities (TBD). Tie-break is stable by Prisma ordering only — add explicit tie rules later.',
    }),
    (0, swagger_1.ApiOkResponse)({ type: leaderboard_row_dto_1.LeaderboardRowDto, isArray: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leaderboard_query_dto_1.NationalLeaderboardQueryDto]),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "national", null);
exports.LeaderboardsController = LeaderboardsController = __decorate([
    (0, swagger_1.ApiTags)('Leaderboards'),
    (0, common_1.Controller)('leaderboards'),
    __metadata("design:paramtypes", [leaderboards_service_1.LeaderboardsService])
], LeaderboardsController);
//# sourceMappingURL=leaderboards.controller.js.map