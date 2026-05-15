import { PrismaService } from '../../prisma/prisma.service';
import { JoinRestrictionAppealDto } from './dto/join-restriction-appeal.dto';
import { PlayerSearchResultDto } from './dto/player-search-result.dto';
import { UpdateHomeModeDto } from './dto/update-home-mode.dto';
import { UpdateProfileContactDto } from './dto/update-profile-contact.dto';
import { UpdateProfilePrivacyDto } from './dto/update-profile-privacy.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UserProfileDto } from './dto/user-profile.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<UserProfileDto>;
    getById(id: string): Promise<UserProfileDto>;
    updateProfilePrivacy(userId: string, dto: UpdateProfilePrivacyDto): Promise<UserProfileDto>;
    submitJoinRestrictionAppeal(userId: string, dto: JoinRestrictionAppealDto): Promise<void>;
    updatePreferences(userId: string, dto: UpdateUserPreferencesDto): Promise<UserProfileDto>;
    updateProfileContact(userId: string, dto: UpdateProfileContactDto): Promise<UserProfileDto>;
    searchPlayers(viewerUserId: string, q: string): Promise<PlayerSearchResultDto[]>;
    updateHomeMode(userId: string, dto: UpdateHomeModeDto): Promise<UserProfileDto>;
    private requireProfile;
    private mapProfileBase;
    private publicProfileExtras;
    private privateNegativeTags;
    private loadRivals;
}
