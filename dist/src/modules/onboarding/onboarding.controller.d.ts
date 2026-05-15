import { OnboardingFormatsDto } from './dto/onboarding-formats.dto';
import { OnboardingGameIdentityDto } from './dto/onboarding-game-identity.dto';
import { OnboardingPersonalDto } from './dto/onboarding-personal.dto';
import { OnboardingStatusDto } from './dto/onboarding-status.dto';
import { OnboardingService } from './onboarding.service';
export declare class OnboardingController {
    private readonly onboardingService;
    constructor(onboardingService: OnboardingService);
    getStatus(user: {
        userId: string;
    }): Promise<OnboardingStatusDto>;
    savePersonal(user: {
        userId: string;
    }, dto: OnboardingPersonalDto): Promise<OnboardingStatusDto>;
    saveGameIdentity(user: {
        userId: string;
    }, dto: OnboardingGameIdentityDto): Promise<OnboardingStatusDto>;
    saveFormats(user: {
        userId: string;
    }, dto: OnboardingFormatsDto): Promise<OnboardingStatusDto>;
    complete(user: {
        userId: string;
    }): Promise<OnboardingStatusDto>;
}
