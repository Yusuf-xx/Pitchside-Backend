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
exports.HomeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
const home_dashboard_query_dto_1 = require("./dto/home-dashboard-query.dto");
const home_dashboard_dto_1 = require("./dto/home-dashboard.dto");
const home_service_1 = require("./home.service");
let HomeController = class HomeController {
    homeService;
    constructor(homeService) {
        this.homeService = homeService;
    }
    dashboard(query, req) {
        return this.homeService.getDashboard({
            userId: req.user?.userId,
            city: query.city,
            gameMode: query.gameMode,
        });
    }
};
exports.HomeController = HomeController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Home dashboard — games, need-players alerts, next match, tournaments, feed, turf teasers',
        description: 'Guests must pass ?city=. Signed-in users use profile city (cannot be TBD). Optional ?gameMode= overrides filter for this response only.',
    }),
    (0, swagger_1.ApiOkResponse)({ type: home_dashboard_dto_1.HomeDashboardDto }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [home_dashboard_query_dto_1.HomeDashboardQueryDto, Object]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "dashboard", null);
exports.HomeController = HomeController = __decorate([
    (0, swagger_1.ApiTags)('Home'),
    (0, common_1.Controller)('home'),
    __metadata("design:paramtypes", [home_service_1.HomeService])
], HomeController);
//# sourceMappingURL=home.controller.js.map