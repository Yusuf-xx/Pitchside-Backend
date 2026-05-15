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
exports.OptionalJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../../prisma/prisma.service");
const auth_constants_1 = require("../auth.constants");
let OptionalJwtAuthGuard = class OptionalJwtAuthGuard {
    jwt;
    prisma;
    constructor(jwt, prisma) {
        this.jwt = jwt;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) {
            return true;
        }
        const token = header.slice(7).trim();
        if (!token) {
            return true;
        }
        try {
            const payload = this.jwt.verify(token, { secret: (0, auth_constants_1.jwtSecret)() });
            if (payload.type !== 'access') {
                return true;
            }
            if (typeof payload.sv !== 'number' || !Number.isInteger(payload.sv) || payload.sv < 0) {
                return true;
            }
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, sessionVersion: true },
            });
            if (!user || user.sessionVersion !== payload.sv) {
                return true;
            }
            req.user = { userId: user.id };
        }
        catch {
        }
        return true;
    }
};
exports.OptionalJwtAuthGuard = OptionalJwtAuthGuard;
exports.OptionalJwtAuthGuard = OptionalJwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], OptionalJwtAuthGuard);
//# sourceMappingURL=optional-jwt-auth.guard.js.map