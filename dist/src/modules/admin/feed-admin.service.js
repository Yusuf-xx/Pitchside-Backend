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
exports.FeedAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FeedAdminService = class FeedAdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const city = dto.city !== undefined && dto.city.trim() !== '' ? dto.city.trim() : null;
        const gameMode = dto.gameMode !== undefined && dto.gameMode.trim() !== ''
            ? dto.gameMode.trim()
            : null;
        const row = await this.prisma.feedEvent.create({
            data: {
                type: dto.type.trim(),
                title: dto.title.trim(),
                body: dto.body.trim(),
                city,
                gameMode,
            },
        });
        return {
            id: row.id,
            type: row.type,
            title: row.title,
            body: row.body,
            city: row.city,
            gameMode: row.gameMode,
            createdAt: row.createdAt.toISOString(),
        };
    }
};
exports.FeedAdminService = FeedAdminService;
exports.FeedAdminService = FeedAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeedAdminService);
//# sourceMappingURL=feed-admin.service.js.map