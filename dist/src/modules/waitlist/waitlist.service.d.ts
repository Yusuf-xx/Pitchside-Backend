import { PrismaService } from '../../prisma/prisma.service';
import { WaitlistSignupDto } from './dto/waitlist-signup.dto';
import { WaitlistSignupResponseDto } from './dto/waitlist-signup-response.dto';
export declare class WaitlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    signup(dto: WaitlistSignupDto): Promise<WaitlistSignupResponseDto>;
}
