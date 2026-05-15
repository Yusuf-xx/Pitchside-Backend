import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddSquadMemberDto } from './dto/add-squad-member.dto';
import { CreateSquadDto } from './dto/create-squad.dto';
import { SquadSummaryDto } from './dto/squad-summary.dto';
import { SquadsService } from './squads.service';

@ApiTags('Squads')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('squads')
export class SquadsController {
  constructor(private readonly squads: SquadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a casual squad (you are captain + first member)' })
  @ApiCreatedResponse({ type: SquadSummaryDto })
  create(@CurrentUser() user: { userId: string }, @Body() dto: CreateSquadDto): Promise<SquadSummaryDto> {
    return this.squads.create(user.userId, dto);
  }

  @Get('mine')
  @ApiOperation({ summary: 'Squads you captain or belong to' })
  @ApiOkResponse({ type: SquadSummaryDto, isArray: true })
  listMine(@CurrentUser() user: { userId: string }): Promise<SquadSummaryDto[]> {
    return this.squads.listMine(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Squad detail (members only)' })
  @ApiOkResponse({ type: SquadSummaryDto })
  getById(@CurrentUser() user: { userId: string }, @Param('id') id: string): Promise<SquadSummaryDto> {
    return this.squads.getById(id, user.userId);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Captain adds a member by user id' })
  @ApiOkResponse({ type: SquadSummaryDto })
  addMember(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: AddSquadMemberDto,
  ): Promise<SquadSummaryDto> {
    return this.squads.addMember(id, user.userId, dto);
  }
}
