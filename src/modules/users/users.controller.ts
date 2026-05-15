import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JoinRestrictionAppealDto } from './dto/join-restriction-appeal.dto';
import { PlayerSearchResultDto } from './dto/player-search-result.dto';
import { UpdateHomeModeDto } from './dto/update-home-mode.dto';
import { UpdateProfileContactDto } from './dto/update-profile-contact.dto';
import { UpdateProfilePrivacyDto } from './dto/update-profile-privacy.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Current user profile' })
  @ApiOkResponse({ type: UserProfileDto })
  getMe(@CurrentUser() user: { userId: string }): Promise<UserProfileDto> {
    return this.usersService.getMe(user.userId);
  }

  @Patch('me/preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update game modes and city' })
  @ApiOkResponse({ type: UserProfileDto })
  updatePreferences(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateUserPreferencesDto,
  ): Promise<UserProfileDto> {
    return this.usersService.updatePreferences(user.userId, dto);
  }

  @Patch('me/home-mode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Persist global home/game feed mode (must be in activeModes)' })
  @ApiOkResponse({ type: UserProfileDto })
  updateHomeMode(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateHomeModeDto,
  ): Promise<UserProfileDto> {
    return this.usersService.updateHomeMode(user.userId, dto);
  }

  @Patch('me/profile-privacy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Gender + women-only discovery toggle (private by default)' })
  @ApiOkResponse({ type: UserProfileDto })
  updateProfilePrivacy(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateProfilePrivacyDto,
  ): Promise<UserProfileDto> {
    return this.usersService.updateProfilePrivacy(user.userId, dto);
  }

  @Post('me/join-restriction-appeal')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Appeal a temporary join restriction (no-show policy)' })
  submitAppeal(
    @CurrentUser() user: { userId: string },
    @Body() dto: JoinRestrictionAppealDto,
  ): Promise<void> {
    return this.usersService.submitJoinRestrictionAppeal(user.userId, dto);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Search players by display name, user id, or registered phone (for squads)' })
  @ApiOkResponse({ type: PlayerSearchResultDto, isArray: true })
  search(
    @CurrentUser() user: { userId: string },
    @Query('q') q?: string,
  ): Promise<PlayerSearchResultDto[]> {
    return this.usersService.searchPlayers(user.userId, q ?? '');
  }

  @Patch('me/contact')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Optional E.164 phone so friends can find you by number' })
  @ApiOkResponse({ type: UserProfileDto })
  updateContact(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateProfileContactDto,
  ): Promise<UserProfileDto> {
    return this.usersService.updateProfileContact(user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Public profile by user id' })
  @ApiOkResponse({ type: UserProfileDto })
  getById(@Param('id') id: string): Promise<UserProfileDto> {
    return this.usersService.getById(id);
  }
}
