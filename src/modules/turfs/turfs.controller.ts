import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import { TurfSummaryDto } from './dto/turf-summary.dto';
import { TurfsService } from './turfs.service';

@ApiTags('Turfs')
@Controller('turfs')
export class TurfsController {
  constructor(private readonly turfsService: TurfsService) {}

  @Get()
  @ApiOperation({ summary: 'Discover turfs' })
  @ApiOkResponse({ type: TurfSummaryDto, isArray: true })
  list(@Query() query: ModeCityQueryDto): Promise<TurfSummaryDto[]> {
    return this.turfsService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Turf detail' })
  @ApiOkResponse({ type: TurfSummaryDto })
  getById(@Param('id') id: string): Promise<TurfSummaryDto> {
    return this.turfsService.getById(id);
  }
}
