import { PrismaService } from '../../prisma/prisma.service';
import { OnboardingFormatsDto } from './dto/onboarding-formats.dto';
import { OnboardingGameIdentityDto } from './dto/onboarding-game-identity.dto';
import { OnboardingPersonalDto } from './dto/onboarding-personal.dto';
import { OnboardingStatusDto } from './dto/onboarding-status.dto';
export declare class OnboardingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStatus(userId: string): Promise<OnboardingStatusDto>;
    savePersonal(userId: string, dto: OnboardingPersonalDto): Promise<OnboardingStatusDto>;
    saveGameIdentity(userId: string, dto: OnboardingGameIdentityDto): Promise<OnboardingStatusDto>;
    saveFormats(userId: string, dto: OnboardingFormatsDto): Promise<OnboardingStatusDto>;
    complete(userId: string): Promise<OnboardingStatusDto>;
    private regeneratePlayerCards;
    private requireProfile;
    private toStatus;
}
