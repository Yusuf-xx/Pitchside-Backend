import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';

@Module({
  imports: [AdminModule],
  controllers: [PartnersController],
  providers: [PartnersService],
})
export class PartnersModule {}
