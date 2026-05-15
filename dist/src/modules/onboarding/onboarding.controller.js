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
exports.OnboardingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const onboarding_formats_dto_1 = require("./dto/onboarding-formats.dto");
const onboarding_game_identity_dto_1 = require("./dto/onboarding-game-identity.dto");
const onboarding_personal_dto_1 = require("./dto/onboarding-personal.dto");
const onboarding_status_dto_1 = require("./dto/onboarding-status.dto");
const onboarding_service_1 = require("./onboarding.service");
let OnboardingController = class OnboardingController {
    onboardingService;
    constructor(onboardingService) {
        this.onboardingService = onboardingService;
    }
    getStatus(user) {
        return this.onboardingService.getStatus(user.userId);
    }
    savePersonal(user, dto) {
        return this.onboardingService.savePersonal(user.userId, dto);
    }
    saveGameIdentity(user, dto) {
        return this.onboardingService.saveGameIdentity(user.userId, dto);
    }
    saveFormats(user, dto) {
        return this.onboardingService.saveFormats(user.userId, dto);
    }
    complete(user) {
        return this.onboardingService.complete(user.userId);
    }
};
exports.OnboardingController = OnboardingController;
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Resume onboarding — current step and flags' }),
    (0, swagger_1.ApiOkResponse)({ type: onboarding_status_dto_1.OnboardingStatusDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('steps/personal'),
    (0, swagger_1.ApiOperation)({ summary: 'Step 1 — personal info, city, DOB, age group, active modes' }),
    (0, swagger_1.ApiCreatedResponse)({ type: onboarding_status_dto_1.OnboardingStatusDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, onboarding_personal_dto_1.OnboardingPersonalDto]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "savePersonal", null);
__decorate([
    (0, common_1.Post)('steps/game-identity'),
    (0, swagger_1.ApiOperation)({ summary: 'Step 2 — per-mode position, foot (football/futsal), skill' }),
    (0, swagger_1.ApiCreatedResponse)({ type: onboarding_status_dto_1.OnboardingStatusDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, onboarding_game_identity_dto_1.OnboardingGameIdentityDto]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "saveGameIdentity", null);
__decorate([
    (0, common_1.Post)('steps/formats'),
    (0, swagger_1.ApiOperation)({ summary: 'Step 3 — preferred formats (multi-select)' }),
    (0, swagger_1.ApiCreatedResponse)({ type: onboarding_status_dto_1.OnboardingStatusDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, onboarding_formats_dto_1.OnboardingFormatsDto]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "saveFormats", null);
__decorate([
    (0, common_1.Post)('complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Step 4 — generate player cards and finish onboarding' }),
    (0, swagger_1.ApiCreatedResponse)({ type: onboarding_status_dto_1.OnboardingStatusDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "complete", null);
exports.OnboardingController = OnboardingController = __decorate([
    (0, swagger_1.ApiTags)('Onboarding'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('onboarding'),
    __metadata("design:paramtypes", [onboarding_service_1.OnboardingService])
], OnboardingController);
//# sourceMappingURL=onboarding.controller.js.map