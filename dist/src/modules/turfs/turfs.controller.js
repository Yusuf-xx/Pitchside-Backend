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
exports.TurfsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mode_city_query_dto_1 = require("../../common/dto/mode-city-query.dto");
const turf_summary_dto_1 = require("./dto/turf-summary.dto");
const turfs_service_1 = require("./turfs.service");
let TurfsController = class TurfsController {
    turfsService;
    constructor(turfsService) {
        this.turfsService = turfsService;
    }
    list(query) {
        return this.turfsService.list(query);
    }
    getById(id) {
        return this.turfsService.getById(id);
    }
};
exports.TurfsController = TurfsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Discover turfs' }),
    (0, swagger_1.ApiOkResponse)({ type: turf_summary_dto_1.TurfSummaryDto, isArray: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mode_city_query_dto_1.ModeCityQueryDto]),
    __metadata("design:returntype", Promise)
], TurfsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Turf detail' }),
    (0, swagger_1.ApiOkResponse)({ type: turf_summary_dto_1.TurfSummaryDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TurfsController.prototype, "getById", null);
exports.TurfsController = TurfsController = __decorate([
    (0, swagger_1.ApiTags)('Turfs'),
    (0, common_1.Controller)('turfs'),
    __metadata("design:paramtypes", [turfs_service_1.TurfsService])
], TurfsController);
//# sourceMappingURL=turfs.controller.js.map