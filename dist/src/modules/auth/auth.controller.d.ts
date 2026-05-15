import { AuthService } from './auth.service';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { ForgotPasswordResponseDto } from './dto/forgot-password-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<AuthTokensDto>;
    login(dto: LoginDto): Promise<AuthTokensDto>;
    refresh(dto: RefreshDto): Promise<AuthTokensDto>;
    logout(user: {
        userId: string;
    }): Promise<ForgotPasswordResponseDto>;
    forgotPassword(dto: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto>;
    resetPassword(dto: ResetPasswordDto): Promise<ForgotPasswordResponseDto>;
}
