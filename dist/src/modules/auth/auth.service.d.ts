import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<AuthTokensDto>;
    login(dto: LoginDto): Promise<AuthTokensDto>;
    refresh(dto: RefreshDto): Promise<AuthTokensDto>;
    invalidateAllSessions(userId: string): Promise<void>;
    requestPasswordReset(dto: ForgotPasswordRequestDto): Promise<void>;
    resetPassword(dto: ResetPasswordDto): Promise<void>;
    private sendPasswordResetEmail;
    private passwordResetMailerConfig;
    private issueTokens;
}
