import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedEventDto } from './dto/create-feed-event.dto';
import { FeedEventCreatedDto } from './dto/feed-event-created.dto';

@Injectable()
export class FeedAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFeedEventDto): Promise<FeedEventCreatedDto> {
    const city =
      dto.city !== undefined && dto.city.trim() !== '' ? dto.city.trim() : null;
    const gameMode =
      dto.gameMode !== undefined && dto.gameMode.trim() !== ''
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
}
