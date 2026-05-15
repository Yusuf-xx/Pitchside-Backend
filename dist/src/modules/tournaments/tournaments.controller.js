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
exports.TournamentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const mode_city_query_dto_1 = require("../../common/dto/mode-city-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_tournament_registration_dto_1 = require("./dto/create-tournament-registration.dto");
const my_tournament_registration_dto_1 = require("./dto/my-tournament-registration.dto");
const tournament_standings_dto_1 = require("./dto/tournament-standings.dto");
const tournament_summary_dto_1 = require("./dto/tournament-summary.dto");
const tournaments_service_1 = require("./tournaments.service");
let TournamentsController = class TournamentsController {
    tournamentsService;
    constructor(tournamentsService) {
        this.tournamentsService = tournamentsService;
    }
    list(query) {
        return this.tournamentsService.list(query);
    }
    myRegistrations(user) {
        return this.tournamentsService.listMyRegistrations(user.userId);
    }
    standings(id) {
        return this.tournamentsService.standings(id);
    }
    register(id, user, dto) {
        return this.tournamentsService.register(id, user.userId, dto);
    }
    getById(id) {
        return this.tournamentsService.getById(id);
    }
};
exports.TournamentsController = TournamentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Discover tournaments (city + mode filters)' }),
    (0, swagger_1.ApiOkResponse)({ type: tournament_summary_dto_1.TournamentSummaryDto, isArray: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mode_city_query_dto_1.ModeCityQueryDto]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('registrations/mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Tournaments you have registered for' }),
    (0, swagger_1.ApiOkResponse)({ type: my_tournament_registration_dto_1.MyTournamentRegistrationDto, isArray: true }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "myRegistrations", null);
__decorate([
    (0, common_1.Get)(':id/standings'),
    (0, swagger_1.ApiOperation)({ summary: 'Standings (placeholder until bracket engine ships)' }),
    (0, swagger_1.ApiOkResponse)({ type: tournament_standings_dto_1.TournamentStandingsDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "standings", null);
__decorate([
    (0, common_1.Post)(':id/registrations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Register your squad for a tournament (one entry per user per event)' }),
    (0, swagger_1.ApiCreatedResponse)({ type: tournament_summary_dto_1.TournamentSummaryDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_tournament_registration_dto_1.CreateTournamentRegistrationDto]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "register", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Tournament detail' }),
    (0, swagger_1.ApiOkResponse)({ type: tournament_summary_dto_1.TournamentSummaryDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TournamentsController.prototype, "getById", null);
exports.TournamentsController = TournamentsController = __decorate([
    (0, swagger_1.ApiTags)('Tournaments'),
    (0, common_1.Controller)('tournaments'),
    __metadata("design:paramtypes", [tournaments_service_1.TournamentsService])
], TournamentsController);
//# sourceMappingURL=tournaments.controller.js.map