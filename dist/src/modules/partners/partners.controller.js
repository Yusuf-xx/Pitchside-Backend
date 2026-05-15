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
exports.PartnersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_access_guard_1 = require("../../common/guards/admin-access.guard");
const partner_interest_dto_1 = require("./dto/partner-interest.dto");
const partner_interest_response_dto_1 = require("./dto/partner-interest-response.dto");
const partner_turf_interest_detail_dto_1 = require("./dto/partner-turf-interest-detail.dto");
const update_partner_turf_interest_dto_1 = require("./dto/update-partner-turf-interest.dto");
const partners_service_1 = require("./partners.service");
let PartnersController = class PartnersController {
    partnersService;
    constructor(partnersService) {
        this.partnersService = partnersService;
    }
    submitTurfInterest(dto) {
        return this.partnersService.submitTurfInterest(dto);
    }
    updateTurfInterest(id, dto) {
        return this.partnersService.updateTurfInterest(id, dto);
    }
};
exports.PartnersController = PartnersController;
__decorate([
    (0, common_1.Post)('turf-interest'),
    (0, swagger_1.ApiOperation)({
        summary: 'Turf owner partner interest',
        description: 'Public intake for venues that want to appear on Pitchside booking. Duplicate email+turf+city returns 409.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: partner_interest_response_dto_1.PartnerInterestResponseDto }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Duplicate submission for same email, turf name, and city' }),
    (0, swagger_1.ApiTooManyRequestsResponse)({ description: 'Too many submissions. Try again later.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [partner_interest_dto_1.PartnerInterestDto]),
    __metadata("design:returntype", Promise)
], PartnersController.prototype, "submitTurfInterest", null);
__decorate([
    (0, common_1.Patch)('turf-interest/:id'),
    (0, common_1.UseGuards)(admin_access_guard_1.AdminAccessGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiHeader)({
        name: 'X-Admin-Key',
        required: false,
        description: 'Alternative to JWT when ADMIN_API_KEY is set',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Update partner turf interest (CRM)',
        description: 'Admin only: X-Admin-Key matching ADMIN_API_KEY, or JWT for an email listed in ADMIN_EMAILS.',
    }),
    (0, swagger_1.ApiOkResponse)({ type: partner_turf_interest_detail_dto_1.PartnerTurfInterestDetailDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid update payload or assignee user does not exist' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Partner interest not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Admin authentication failed or account is not allowlisted' }),
    (0, swagger_1.ApiServiceUnavailableResponse)({ description: 'Admin access not configured (set ADMIN_EMAILS and/or ADMIN_API_KEY)' }),
    (0, swagger_1.ApiTooManyRequestsResponse)({ description: 'Too many admin requests. Try again later.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_partner_turf_interest_dto_1.UpdatePartnerTurfInterestDto]),
    __metadata("design:returntype", Promise)
], PartnersController.prototype, "updateTurfInterest", null);
exports.PartnersController = PartnersController = __decorate([
    (0, swagger_1.ApiTags)('Partners'),
    (0, common_1.Controller)('partners'),
    __metadata("design:paramtypes", [partners_service_1.PartnersService])
], PartnersController);
//# sourceMappingURL=partners.controller.js.map