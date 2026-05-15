import { PartnerInterestDto } from './dto/partner-interest.dto';
import { PartnerInterestResponseDto } from './dto/partner-interest-response.dto';
import { PartnerTurfInterestDetailDto } from './dto/partner-turf-interest-detail.dto';
import { UpdatePartnerTurfInterestDto } from './dto/update-partner-turf-interest.dto';
import { PartnersService } from './partners.service';
export declare class PartnersController {
    private readonly partnersService;
    constructor(partnersService: PartnersService);
    submitTurfInterest(dto: PartnerInterestDto): Promise<PartnerInterestResponseDto>;
    updateTurfInterest(id: string, dto: UpdatePartnerTurfInterestDto): Promise<PartnerTurfInterestDetailDto>;
}
