import { JoinRestrictionAppealDto } from './dto/join-restriction-appeal.dto';
import { PlayerSearchResultDto } from './dto/player-search-result.dto';
import { UpdateHomeModeDto } from './dto/update-home-mode.dto';
import { UpdateProfileContactDto } from './dto/update-profile-contact.dto';
import { UpdateProfilePrivacyDto } from './dto/update-profile-privacy.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: {
        userId: string;
    }): Promise<UserProfileDto>;
    updatePreferences(user: {
        userId: string;
    }, dto: UpdateUserPreferencesDto): Promise<UserProfileDto>;
    updateHomeMode(user: {
        userId: string;
    }, dto: UpdateHomeModeDto): Promise<UserProfileDto>;
    updateProfilePrivacy(user: {
        userId: string;
    }, dto: UpdateProfilePrivacyDto): Promise<UserProfileDto>;
    submitAppeal(user: {
        userId: string;
    }, dto: JoinRestrictionAppealDto): Promise<void>;
    search(user: {
        userId: string;
    }, q?: string): Promise<PlayerSearchResultDto[]>;
    updateContact(user: {
        userId: string;
    }, dto: UpdateProfileContactDto): Promise<UserProfileDto>;
    getById(id: string): Promise<UserProfileDto>;
}
