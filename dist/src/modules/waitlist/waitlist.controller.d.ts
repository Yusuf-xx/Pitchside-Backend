import { WaitlistSignupDto } from './dto/waitlist-signup.dto';
import { WaitlistSignupResponseDto } from './dto/waitlist-signup-response.dto';
import { WaitlistService } from './waitlist.service';
export declare class WaitlistController {
    private readonly waitlistService;
    constructor(waitlistService: WaitlistService);
    signup(dto: WaitlistSignupDto): Promise<WaitlistSignupResponseDto>;
}
