import { Module } from '@nestjs/common';
import { GameRecordsController } from './game-records.controller';
import { GameRecordsService } from './game-records.service';

@Module({
  controllers: [GameRecordsController],
  providers: [GameRecordsService],
})
export class GameRecordsModule {}
