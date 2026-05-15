import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { ForgotPasswordResponseDto } from './dto/forgot-password-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create account — returns access and refresh JWTs' })
  @ApiCreatedResponse({ type: AuthTokensDto })
  @ApiConflictResponse({ description: 'Email already registered' })
  @ApiTooManyRequestsResponse({ description: 'Too many auth attempts. Try again later.' })
  register(@Body() dto: RegisterDto): Promise<AuthTokensDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Sign in with email + password' })
  @ApiOkResponse({ type: AuthTokensDto })
  @ApiUnauthorizedResponse({
    description: 'LOGIN_EMAIL_NOT_FOUND (no account) or LOGIN_INVALID_PASSWORD (wrong password)',
  })
  @ApiTooManyRequestsResponse({ description: 'Too many auth attempts. Try again later.' })
  login(@Body() dto: LoginDto): Promise<AuthTokensDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Exchange a valid refresh token for a new access/refresh token pair' })
  @ApiOkResponse({ type: AuthTokensDto })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  @ApiTooManyRequestsResponse({ description: 'Too many auth attempts. Try again later.' })
  refresh(@Body() dto: RefreshDto): Promise<AuthTokensDto> {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Sign out — invalidates all access and refresh tokens for this account' })
  @ApiOkResponse({ type: ForgotPasswordResponseDto })
  @ApiTooManyRequestsResponse({ description: 'Too many auth attempts. Try again later.' })
  async logout(@CurrentUser() user: { userId: string }): Promise<ForgotPasswordResponseDto> {
    await this.authService.invalidateAllSessions(user.userId);
    return { message: 'Signed out. All sessions for this account are now invalid.' };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiOkResponse({ type: ForgotPasswordResponseDto })
  @ApiServiceUnavailableResponse({ description: 'Password reset delivery is not configured' })
  @ApiTooManyRequestsResponse({ description: 'Too many auth attempts. Try again later.' })
  async forgotPassword(@Body() dto: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
    await this.authService.requestPasswordReset(dto);
    return { message: 'If this email exists, a password reset link has been sent.' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using a valid reset token' })
  @ApiOkResponse({ type: ForgotPasswordResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired password reset token' })
  @ApiTooManyRequestsResponse({ description: 'Too many auth attempts. Try again later.' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<ForgotPasswordResponseDto> {
    await this.authService.resetPassword(dto);
    return { message: 'Password reset successful. Please sign in with your new password.' };
  }
}
