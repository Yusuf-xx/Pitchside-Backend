"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const nodemailer_1 = __importDefault(require("nodemailer"));
const auth_constants_1 = require("./auth.constants");
const game_mode_enum_1 = require("../../common/enums/game-mode.enum");
const prisma_service_1 = require("../../prisma/prisma.service");
function requiredEnv(name) {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`${name} is required`);
    }
    return value;
}
function requiredPositiveIntEnv(name) {
    const raw = requiredEnv(name);
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
        throw new Error(`${name} must be a positive integer`);
    }
    return parsed;
}
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        const email = dto.email.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
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
                        primaryMode: game_mode_enum_1.GameMode.FOOTBALL,
                        onboardingStep: 0,
                        onboardingCompleted: false,
                    },
                },
            },
        });
        return await this.issueTokens(user.id);
    }
    async login(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('LOGIN_EMAIL_NOT_FOUND');
        }
        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok) {
            throw new common_1.UnauthorizedException('LOGIN_INVALID_PASSWORD');
        }
        return await this.issueTokens(user.id);
    }
    async refresh(dto) {
        try {
            const payload = this.jwt.verify(dto.refreshToken, {
                secret: (0, auth_constants_1.jwtSecret)(),
            });
            if (payload.type !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            if (typeof payload.sv !== 'number' || !Number.isInteger(payload.sv) || payload.sv < 0) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, sessionVersion: true },
            });
            if (!user || user.sessionVersion !== payload.sv) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            return await this.issueTokens(payload.sub);
        }
        catch (e) {
            if (e instanceof common_1.UnauthorizedException) {
                throw e;
            }
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async invalidateAllSessions(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { sessionVersion: { increment: 1 } },
        });
    }
    async requestPasswordReset(dto) {
        this.passwordResetMailerConfig();
        const email = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return;
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const tokenHash = (0, crypto_1.createHash)('sha256').update(token).digest('hex');
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
    async resetPassword(dto) {
        const tokenHash = (0, crypto_1.createHash)('sha256').update(dto.token.trim()).digest('hex');
        const token = await this.prisma.passwordResetToken.findUnique({
            where: { tokenHash },
        });
        if (!token || token.usedAt || token.expiresAt <= new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired password reset token');
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
    async sendPasswordResetEmail(toEmail, resetUrl) {
        const { host, port, user, pass, from } = this.passwordResetMailerConfig();
        const transporter = nodemailer_1.default.createTransport({
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
    passwordResetMailerConfig() {
        const host = process.env.SMTP_HOST?.trim();
        const portRaw = process.env.SMTP_PORT?.trim();
        const user = process.env.SMTP_USER?.trim();
        const pass = process.env.SMTP_PASS?.trim();
        const from = process.env.SMTP_FROM?.trim();
        if (!host || !portRaw || !user || !pass || !from) {
            throw new common_1.ServiceUnavailableException('SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM must be set for password reset email delivery');
        }
        const port = Number.parseInt(portRaw, 10);
        if (!Number.isFinite(port) || port < 1) {
            throw new common_1.ServiceUnavailableException('SMTP_PORT must be a positive integer');
        }
        return { host, port, user, pass, from };
    }
    async issueTokens(userId) {
        const row = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            select: { id: true, sessionVersion: true },
        });
        const sv = row.sessionVersion;
        const accessExpiresIn = (0, auth_constants_1.accessTokenTtlSec)();
        const refreshExpiresIn = (0, auth_constants_1.refreshTokenTtlSec)();
        const accessToken = this.jwt.sign({ sub: userId, type: 'access', sv }, { expiresIn: accessExpiresIn });
        const refreshToken = this.jwt.sign({ sub: userId, type: 'refresh', sv }, { expiresIn: refreshExpiresIn });
        return {
            accessToken,
            refreshToken,
            expiresIn: accessExpiresIn,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map