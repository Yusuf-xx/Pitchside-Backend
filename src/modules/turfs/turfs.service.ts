import { Injectable, NotFoundException } from '@nestjs/common';
import { prismaCityEqualsInsensitive } from '../../common/city-normalize.util';
import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { TurfSummaryDto } from './dto/turf-summary.dto';
import { mapTurfRow } from './turfs.mapper';

@Injectable()
export class TurfsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ModeCityQueryDto): Promise<TurfSummaryDto[]> {
    const rows = await this.prisma.turf.findMany({
      where: {
        ...(query.city?.trim() ? { city: prismaCityEqualsInsensitive(query.city) } : {}),
      },
      orderBy: [{ partner: 'desc' }, { name: 'asc' }],
    });
    const mapped = rows.map(mapTurfRow);
    let out = !query.gameMode ? mapped : mapped.filter((t) => t.modes.includes(query.gameMode!));
    if (query.footballVenueSubFormat) {
      out = out.filter(
        (t) =>
          t.modes.includes(GameMode.FOOTBALL) &&
          Boolean(t.footballVenueSubFormats?.includes(query.footballVenueSubFormat!)),
      );
    }
    return out;
  }

  async getById(id: string): Promise<TurfSummaryDto> {
    const row = await this.prisma.turf.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Turf not found');
    return mapTurfRow(row);
  }

  /** Load turf row for booking validation (throws if missing). */
  async requireTurfRow(id: string) {
    const row = await this.prisma.turf.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Turf not found');
    return row;
  }
}
