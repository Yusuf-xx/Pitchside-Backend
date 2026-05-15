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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_tokens_dto_1 = require("./dto/auth-tokens.dto");
const forgot_password_request_dto_1 = require("./dto/forgot-password-request.dto");
const forgot_password_response_dto_1 = require("./dto/forgot-password-response.dto");
const login_dto_1 = require("./dto/login.dto");
const refresh_dto_1 = require("./dto/refresh.dto");
const register_dto_1 = require("./dto/register.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(dto) {
        return this.authService.register(dto);
    }
    login(dto) {
        return this.authService.login(dto);
    }
    refresh(dto) {
        return this.authService.refresh(dto);
    }
    async logout(user) {
        await this.authService.invalidateAllSessions(user.userId);
        return { message: 'Signed out. All sessions for this account are now invalid.' };
    }
    async forgotPassword(dto) {
        await this.authService.requestPasswordReset(dto);
        return { message: 'If this email exists, a password reset link has been sent.' };
    }
    async resetPassword(dto) {
        await this.authService.resetPassword(dto);
        return { message: 'Password reset successful. Please sign in with your new password.' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Create account — returns access and refresh JWTs' }),
    (0, swagger_1.ApiCreatedResponse)({ type: auth_tokens_dto_1.AuthTokensDto }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Email already registered' }),
    (0, swagger_1.ApiTooManyRequestsResponse)({ description: 'Too many auth attempts. Try again later.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Sign in with email + password' }),
    (0, swagger_1.ApiOkResponse)({ type: auth_tokens_dto_1.AuthTokensDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'LOGIN_EMAIL_NOT_FOUND (no account) or LOGIN_INVALID_PASSWORD (wrong password)',
    }),
    (0, swagger_1.ApiTooManyRequestsResponse)({ description: 'Too many auth attempts. Try again later.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Exchange a valid refresh token for a new access/refresh token pair' }),
    (0, swagger_1.ApiOkResponse)({ type: auth_tokens_dto_1.AuthTokensDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid refresh token' }),
    (0, swagger_1.ApiTooManyRequestsResponse)({ description: 'Too many auth attempts. Try again later.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_dto_1.RefreshDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Sign out — invalidates all access and refresh tokens for this account' }),
    (0, swagger_1.ApiOkResponse)({ type: forgot_password_response_dto_1.ForgotPasswordResponseDto }),
    (0, swagger_1.ApiTooManyRequestsResponse)({ description: 'Too many auth attempts. Try again later.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset email' }),
    (0, swagger_1.ApiOkResponse)({ type: forgot_password_response_dto_1.ForgotPasswordResponseDto }),
    (0, swagger_1.ApiServiceUnavailableResponse)({ description: 'Password reset delivery is not configured' }),
    (0, swagger_1.ApiTooManyRequestsResponse)({ description: 'Too many auth attempts. Try again later.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_request_dto_1.ForgotPasswordRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using a valid reset token' }),
    (0, swagger_1.ApiOkResponse)({ type: forgot_password_response_dto_1.ForgotPasswordResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid or expired password reset token' }),
    (0, swagger_1.ApiTooManyRequestsResponse)({ description: 'Too many auth attempts. Try again later.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map