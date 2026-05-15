import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SquadsModule } from '../squads/squads.module';
import { GamesController } from './games.controller';
import { GamesEngagementDigestService } from './games-engagement-digest.service';
import { GamesLifecycleService } from './games-lifecycle.service';
import { GamesRecapNudgeService } from './games-recap-nudge.service';
import { GamesService } from './games.service';
import { RecapService } from './recap.service';

@Module({
  imports: [AuthModule, NotificationsModule, SquadsModule],
  controllers: [GamesController],
  providers: [
    GamesService,
    GamesLifecycleService,
    GamesRecapNudgeService,
    GamesEngagementDigestService,
    RecapService,
  ],
  exports: [GamesService],
})
export class GamesModule {}
