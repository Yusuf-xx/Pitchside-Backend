import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { SquadsController } from './squads.controller';
import { SquadsService } from './squads.service';

@Module({
  imports: [NotificationsModule],
  controllers: [SquadsController],
  providers: [SquadsService],
  exports: [SquadsService],
})
export class SquadsModule {}
