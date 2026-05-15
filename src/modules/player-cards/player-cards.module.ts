import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PlayerCardsController } from './player-cards.controller';
import { PlayerCardsService } from './player-cards.service';

@Module({
  imports: [AuthModule],
  controllers: [PlayerCardsController],
  providers: [PlayerCardsService],
})
export class PlayerCardsModule {}
