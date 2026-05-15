import { ConflictException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { accessTokenTtlSec, jwtSecret, refreshTokenTtlSec } from './auth.constants';
import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { JwtPayload } from './strategies/jwt.strategy';

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function requiredPositiveIntEnv(name: string): number {
  const raw = requiredEnv(name);
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokensDto> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            displayName: dto.displayName.trim(),
            city: 'TBD',
            ageGroup: 'OPEN',
            primaryMode: GameMode.FOOTBALL,
            onboardingStep: 0,
            onboardingCompleted: false,
          },
        },
      },
    });
    return await this.issueTokens(user.id);
  }

  async login(dto: LoginDto): Promise<AuthTokensDto> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('LOGIN_EMAIL_NOT_FOUND');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('LOGIN_INVALID_PASSWORD');
    }
    return await this.issueTokens(user.id);
  }

  async refresh(dto: RefreshDto): Promise<AuthTokensDto> {
    try {
      const payload = this.jwt.verify<JwtPayload>(dto.refreshToken, {
        secret: jwtSecret(),
      });
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      if (typeof payload.sv !== 'number' || !Number.isInteger(payload.sv) || payload.sv < 0) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, sessionVersion: true },
      });
      if (!user || user.sessionVersion !== payload.sv) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return await this.issueTokens(payload.sub);
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /** Invalidates all access and refresh JWTs for this user (sign out everywhere). */
  async invalidateAllSessions(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { sessionVersion: { increment: 1 } },
    });
  }

  async requestPasswordReset(dto: ForgotPasswordRequestDto): Promise<void> {
    this.passwordResetMailerConfig();
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return;
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const ttlMinutes = requiredPositiveIntEnv('PASSWORD_RESET_TOKEN_TTL_MINUTES');
    const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);

    await this.prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      });
      await tx.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });
    });

    const baseUrl = requiredEnv('PASSWORD_RESET_URL_BASE').replace(/\/+$/, '');
    const resetUrl = `${baseUrl}?token=${encodeURIComponent(token)}`;
    await this.sendPasswordResetEmail(user.email, resetUrl);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const tokenHash = createHash('sha256').update(dto.token.trim()).digest('hex');
    const token = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
    if (!token || token.usedAt || token.expiresAt <= new Date()) {
      throw new UnauthorizedException('Invalid or expired password reset token');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: token.userId },
        data: {
          passwordHash,
          sessionVersion: { increment: 1 },
        },
      });
      await tx.passwordResetToken.updateMany({
        where: {
          userId: token.userId,
          usedAt: null,
        },
        data: { usedAt: new Date() },
      });
    });
  }

  private async sendPasswordResetEmail(toEmail: string, resetUrl: string): Promise<void> {
    const { host, port, user, pass, from } = this.passwordResetMailerConfig();

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: toEmail,
      subject: 'Pitchside password reset',
      text: `Reset your password using this link: ${resetUrl}`,
      html: `<p>Reset your password using this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });
  }

  private passwordResetMailerConfig(): {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  } {
    const host = process.env.SMTP_HOST?.trim();
    const portRaw = process.env.SMTP_PORT?.trim();
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();
    const from = process.env.SMTP_FROM?.trim();
    if (!host || !portRaw || !user || !pass || !from) {
      throw new ServiceUnavailableException(
        'SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM must be set for password reset email delivery',
      );
    }
    const port = Number.parseInt(portRaw, 10);
    if (!Number.isFinite(port) || port < 1) {
      throw new ServiceUnavailableException('SMTP_PORT must be a positive integer');
    }
    return { host, port, user, pass, from };
  }

  private async issueTokens(userId: string): Promise<AuthTokensDto> {
    const row = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, sessionVersion: true },
    });
    const sv = row.sessionVersion;
    const accessExpiresIn = accessTokenTtlSec();
    const refreshExpiresIn = refreshTokenTtlSec();
    const accessToken = this.jwt.sign(
      { sub: userId, type: 'access', sv } satisfies JwtPayload,
      { expiresIn: accessExpiresIn },
    );
    const refreshToken = this.jwt.sign(
      { sub: userId, type: 'refresh', sv } satisfies JwtPayload,
      { expiresIn: refreshExpiresIn },
    );
    return {
      accessToken,
      refreshToken,
      expiresIn: accessExpiresIn,
    };
  }
}
