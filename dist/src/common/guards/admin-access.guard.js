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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_constants_1 = require("../../modules/auth/auth.constants");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminAccessGuard = class AdminAccessGuard {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const envKey = process.env.ADMIN_API_KEY?.trim();
        const headerKey = typeof req.headers['x-admin-key'] === 'string' ? req.headers['x-admin-key'].trim() : undefined;
        if (envKey && headerKey === envKey) {
            req.adminAccess = { type: 'api_key' };
            return true;
        }
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            throw new common_1.ForbiddenException('Admin authentication required');
        }
        const token = auth.slice(7).trim();
        let payload;
        try {
            payload = this.jwt.verify(token, { secret: (0, auth_constants_1.jwtSecret)() });
        }
        catch {
            throw new common_1.ForbiddenException('Invalid token');
        }
        if (payload.type !== 'access') {
            throw new common_1.ForbiddenException('Invalid admin token type');
        }
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) {
            throw new common_1.ForbiddenException('User not found');
        }
        const allowlist = (process.env.ADMIN_EMAILS ?? '')
            .split(',')
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);
        if (allowlist.length === 0 && !envKey) {
            throw new common_1.ServiceUnavailableException('Admin access is not configured (set ADMIN_EMAILS and/or ADMIN_API_KEY)');
        }
        if (!allowlist.includes(user.email.toLowerCase())) {
            throw new common_1.ForbiddenException('Not an admin');
        }
        req.adminAccess = { type: 'jwt', userId: user.id, email: user.email };
        return true;
    }
};
exports.AdminAccessGuard = AdminAccessGuard;
exports.AdminAccessGuard = AdminAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AdminAccessGuard);
//# sourceMappingURL=admin-access.guard.js.map