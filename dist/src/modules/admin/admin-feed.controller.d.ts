import { FeedAdminService } from './feed-admin.service';
import { CreateFeedEventDto } from './dto/create-feed-event.dto';
import { FeedEventCreatedDto } from './dto/feed-event-created.dto';
export declare class AdminFeedController {
    private readonly feedAdmin;
    constructor(feedAdmin: FeedAdminService);
    createFeedEvent(dto: CreateFeedEventDto): Promise<FeedEventCreatedDto>;
}
