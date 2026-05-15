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
exports.PartnersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const partner_interest_constants_1 = require("../../common/constants/partner-interest.constants");
const prisma_service_1 = require("../../prisma/prisma.service");
function resolveSource(raw) {
    const v = raw?.trim();
    if (v && partner_interest_constants_1.PARTNER_INTEREST_SOURCES.includes(v)) {
        return v;
    }
    return 'WEB_FORM';
}
let PartnersService = class PartnersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitTurfInterest(dto) {
        const email = dto.email.trim().toLowerCase();
        const turfName = dto.turfName.trim();
        const city = dto.city.trim();
        const contactNumber = dto.contactNumber.trim().replace(/\s+/g, ' ');
        const notes = dto.notes?.trim() ? dto.notes.trim().slice(0, 2000) : null;
        const source = resolveSource(dto.source);
        try {
            const row = await this.prisma.partnerTurfInterest.create({
                data: {
                    email,
                    turfName,
                    city,
                    contactNumber,
                    notes,
                    source,
                },
            });
            return {
                id: row.id,
                createdAt: row.createdAt.toISOString(),
            };
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('We already have this venue signup — try another email or adjust turf name/city if it was a typo.');
            }
            throw e;
        }
    }
    async updateTurfInterest(id, dto) {
        const row = await this.prisma.partnerTurfInterest.findUnique({ where: { id } });
        if (!row) {
            throw new common_1.NotFoundException('Partner interest not found');
        }
        const hasChange = dto.status !== undefined ||
            dto.assignedToUserId !== undefined ||
            dto.notes !== undefined;
        if (!hasChange) {
            throw new common_1.BadRequestException('No fields to update');
        }
        if (dto.assignedToUserId !== undefined && dto.assignedToUserId !== null) {
            const assignee = await this.prisma.user.findUnique({
                where: { id: dto.assignedToUserId },
            });
            if (!assignee) {
                throw new common_1.BadRequestException('Assignee user not found');
            }
        }
        const notes = dto.notes !== undefined
            ? dto.notes === null || dto.notes.trim() === ''
                ? null
                : dto.notes.trim().slice(0, 4000)
            : undefined;
        const updated = await this.prisma.partnerTurfInterest.update({
            where: { id },
            data: {
                ...(dto.status !== undefined ? { status: dto.status } : {}),
                ...(dto.assignedToUserId !== undefined
                    ? { assignedToUserId: dto.assignedToUserId }
                    : {}),
                ...(notes !== undefined ? { notes } : {}),
            },
        });
        return {
            id: updated.id,
            turfName: updated.turfName,
            city: updated.city,
            contactNumber: updated.contactNumber,
            email: updated.email,
            status: updated.status,
            assignedToUserId: updated.assignedToUserId,
            notes: updated.notes,
            source: updated.source,
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
        };
    }
};
exports.PartnersService = PartnersService;
exports.PartnersService = PartnersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PartnersService);
//# sourceMappingURL=partners.service.js.map