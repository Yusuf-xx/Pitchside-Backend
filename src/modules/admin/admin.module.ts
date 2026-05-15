import { Module } from '@nestjs/common';
import { AdminAccessGuard } from '../../common/guards/admin-access.guard';
import { NotificationsModule } from '../notifications/notifications.module';
import { AdminAppealsController } from './admin-appeals.controller';
import { AdminAppealsService } from './admin-appeals.service';
import { AdminFeedController } from './admin-feed.controller';
import { FeedAdminService } from './feed-admin.service';

@Module({
  imports: [NotificationsModule],
  controllers: [AdminFeedController, AdminAppealsController],
  providers: [AdminAccessGuard, FeedAdminService, AdminAppealsService],
  exports: [AdminAccessGuard],
})
export class AdminModule {}
