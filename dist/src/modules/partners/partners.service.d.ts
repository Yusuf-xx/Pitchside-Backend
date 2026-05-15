import { PrismaService } from '../../prisma/prisma.service';
import { PartnerInterestDto } from './dto/partner-interest.dto';
import { PartnerInterestResponseDto } from './dto/partner-interest-response.dto';
import { PartnerTurfInterestDetailDto } from './dto/partner-turf-interest-detail.dto';
import { UpdatePartnerTurfInterestDto } from './dto/update-partner-turf-interest.dto';
export declare class PartnersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    submitTurfInterest(dto: PartnerInterestDto): Promise<PartnerInterestResponseDto>;
    updateTurfInterest(id: string, dto: UpdatePartnerTurfInterestDto): Promise<PartnerTurfInterestDetailDto>;
}
