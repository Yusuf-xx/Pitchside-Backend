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
exports.AdminAppealsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_access_guard_1 = require("../../common/guards/admin-access.guard");
const admin_appeals_service_1 = require("./admin-appeals.service");
const admin_appeal_item_dto_1 = require("./dto/admin-appeal-item.dto");
const list_appeals_query_dto_1 = require("./dto/list-appeals-query.dto");
const resolve_appeal_dto_1 = require("./dto/resolve-appeal.dto");
let AdminAppealsController = class AdminAppealsController {
    appeals;
    constructor(appeals) {
        this.appeals = appeals;
    }
    list(query) {
        return this.appeals.list(query);
    }
    resolve(id, dto, req) {
        return this.appeals.resolve(id, dto, req);
    }
};
exports.AdminAppealsController = AdminAppealsController;
__decorate([
    (0, common_1.Get)('appeals'),
    (0, common_1.UseGuards)(admin_access_guard_1.AdminAccessGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'List join-restriction appeals',
        description: 'Requires admin auth (same as feed-events): X-Admin-Key or JWT for ADMIN_EMAILS.',
    }),
    (0, swagger_1.ApiOkResponse)({ type: admin_appeal_item_dto_1.AdminAppealItemDto, isArray: true }),
    (0, swagger_1.ApiForbiddenResponse)(),
    (0, swagger_1.ApiServiceUnavailableResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_appeals_query_dto_1.ListAppealsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminAppealsController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)('appeals/:id'),
    (0, common_1.UseGuards)(admin_access_guard_1.AdminAccessGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Approve or reject an appeal',
        description: 'APPROVE clears the player join restriction and rejects other OPEN appeals for the same user. REJECT leaves the restriction in place.',
    }),
    (0, swagger_1.ApiOkResponse)({ type: admin_appeal_item_dto_1.AdminAppealItemDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, resolve_appeal_dto_1.ResolveAppealDto, Object]),
    __metadata("design:returntype", Promise)
], AdminAppealsController.prototype, "resolve", null);
exports.AdminAppealsController = AdminAppealsController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiHeader)({
        name: 'X-Admin-Key',
        required: false,
        description: 'Alternative to JWT when ADMIN_API_KEY is set',
    }),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_appeals_service_1.AdminAppealsService])
], AdminAppealsController);
//# sourceMappingURL=admin-appeals.controller.js.map