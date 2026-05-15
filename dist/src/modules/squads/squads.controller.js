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
exports.SquadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const add_squad_member_dto_1 = require("./dto/add-squad-member.dto");
const create_squad_dto_1 = require("./dto/create-squad.dto");
const squad_summary_dto_1 = require("./dto/squad-summary.dto");
const squads_service_1 = require("./squads.service");
let SquadsController = class SquadsController {
    squads;
    constructor(squads) {
        this.squads = squads;
    }
    create(user, dto) {
        return this.squads.create(user.userId, dto);
    }
    listMine(user) {
        return this.squads.listMine(user.userId);
    }
    getById(user, id) {
        return this.squads.getById(id, user.userId);
    }
    addMember(user, id, dto) {
        return this.squads.addMember(id, user.userId, dto);
    }
};
exports.SquadsController = SquadsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a casual squad (you are captain + first member)' }),
    (0, swagger_1.ApiCreatedResponse)({ type: squad_summary_dto_1.SquadSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_squad_dto_1.CreateSquadDto]),
    __metadata("design:returntype", Promise)
], SquadsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, swagger_1.ApiOperation)({ summary: 'Squads you captain or belong to' }),
    (0, swagger_1.ApiOkResponse)({ type: squad_summary_dto_1.SquadSummaryDto, isArray: true }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SquadsController.prototype, "listMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Squad detail (members only)' }),
    (0, swagger_1.ApiOkResponse)({ type: squad_summary_dto_1.SquadSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SquadsController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Captain adds a member by user id' }),
    (0, swagger_1.ApiOkResponse)({ type: squad_summary_dto_1.SquadSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_squad_member_dto_1.AddSquadMemberDto]),
    __metadata("design:returntype", Promise)
], SquadsController.prototype, "addMember", null);
exports.SquadsController = SquadsController = __decorate([
    (0, swagger_1.ApiTags)('Squads'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('squads'),
    __metadata("design:paramtypes", [squads_service_1.SquadsService])
], SquadsController);
//# sourceMappingURL=squads.controller.js.map