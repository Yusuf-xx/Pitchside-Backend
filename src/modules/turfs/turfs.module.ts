import { Module } from '@nestjs/common';
import { TurfsController } from './turfs.controller';
import { TurfsService } from './turfs.service';

@Module({
  controllers: [TurfsController],
  providers: [TurfsService],
  exports: [TurfsService],
})
export class TurfsModule {}
