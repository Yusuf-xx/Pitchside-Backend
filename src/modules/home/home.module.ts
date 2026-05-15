import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GamesModule } from '../games/games.module';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { TurfsModule } from '../turfs/turfs.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [AuthModule, GamesModule, TurfsModule, TournamentsModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
