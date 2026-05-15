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
exports.TrainingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const gps_dto_1 = require("./dto/gps.dto");
const patch_training_goal_dto_1 = require("./dto/patch-training-goal.dto");
const training_status_dto_1 = require("./dto/training-status.dto");
const training_service_1 = require("./training.service");
let TrainingController = class TrainingController {
    trainingService;
    constructor(trainingService) {
        this.trainingService = trainingService;
    }
    status(user) {
        return this.trainingService.getStatus(user.userId);
    }
    clockIn(user, body) {
        return this.trainingService.clockIn(user.userId, body);
    }
    clockOut(user) {
        return this.trainingService.clockOut(user.userId);
    }
    patchGoal(user, dto) {
        return this.trainingService.updateWeeklyGoal(user.userId, dto.weeklyGoalMinutes);
    }
};
exports.TrainingController = TrainingController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Weekly progress & streak',
        description: 'Weekly minutes sum completed sessions whose end time falls in the current India week (Monday 00:00 Asia/Kolkata through the following Monday). Streak uses consecutive IST calendar days with at least 10 logged minutes; today (IST) can be empty without breaking the streak yet.',
    }),
    (0, swagger_1.ApiOkResponse)({ type: training_status_dto_1.TrainingStatusDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "status", null);
__decorate([
    (0, common_1.Post)('clock-in'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a training session (optional GPS for future validation)' }),
    (0, swagger_1.ApiOkResponse)({ type: training_status_dto_1.TrainingStatusDto }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Already clocked in' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, gps_dto_1.GpsDto]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Post)('clock-out'),
    (0, swagger_1.ApiOperation)({ summary: 'End the open session and credit minutes (capped per session)' }),
    (0, swagger_1.ApiOkResponse)({ type: training_status_dto_1.TrainingStatusDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Not clocked in' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "clockOut", null);
__decorate([
    (0, common_1.Patch)('me/goal'),
    (0, swagger_1.ApiOperation)({ summary: 'Update weekly minute goal' }),
    (0, swagger_1.ApiOkResponse)({ type: training_status_dto_1.TrainingStatusDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, patch_training_goal_dto_1.PatchTrainingGoalDto]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "patchGoal", null);
exports.TrainingController = TrainingController = __decorate([
    (0, swagger_1.ApiTags)('Training'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('training'),
    __metadata("design:paramtypes", [training_service_1.TrainingService])
], TrainingController);
//# sourceMappingURL=training.controller.js.map