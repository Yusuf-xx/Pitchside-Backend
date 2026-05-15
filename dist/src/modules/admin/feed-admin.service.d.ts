import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedEventDto } from './dto/create-feed-event.dto';
import { FeedEventCreatedDto } from './dto/feed-event-created.dto';
export declare class FeedAdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateFeedEventDto): Promise<FeedEventCreatedDto>;
}
