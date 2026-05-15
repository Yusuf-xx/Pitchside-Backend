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
exports.TurfsService = void 0;
const common_1 = require("@nestjs/common");
const city_normalize_util_1 = require("../../common/city-normalize.util");
const game_mode_enum_1 = require("../../common/enums/game-mode.enum");
const prisma_service_1 = require("../../prisma/prisma.service");
const turfs_mapper_1 = require("./turfs.mapper");
let TurfsService = class TurfsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const rows = await this.prisma.turf.findMany({
            where: {
                ...(query.city?.trim() ? { city: (0, city_normalize_util_1.prismaCityEqualsInsensitive)(query.city) } : {}),
            },
            orderBy: [{ partner: 'desc' }, { name: 'asc' }],
        });
        const mapped = rows.map(turfs_mapper_1.mapTurfRow);
        let out = !query.gameMode ? mapped : mapped.filter((t) => t.modes.includes(query.gameMode));
        if (query.footballVenueSubFormat) {
            out = out.filter((t) => t.modes.includes(game_mode_enum_1.GameMode.FOOTBALL) &&
                Boolean(t.footballVenueSubFormats?.includes(query.footballVenueSubFormat)));
        }
        return out;
    }
    async getById(id) {
        const row = await this.prisma.turf.findUnique({ where: { id } });
        if (!row)
            throw new common_1.NotFoundException('Turf not found');
        return (0, turfs_mapper_1.mapTurfRow)(row);
    }
    async requireTurfRow(id) {
        const row = await this.prisma.turf.findUnique({ where: { id } });
        if (!row)
            throw new common_1.NotFoundException('Turf not found');
        return row;
    }
};
exports.TurfsService = TurfsService;
exports.TurfsService = TurfsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TurfsService);
//# sourceMappingURL=turfs.service.js.map