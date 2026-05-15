import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamDetailDto } from './dto/team-detail.dto';
import { TeamSummaryDto } from './dto/team-summary.dto';
export declare class TeamsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listMine(userId: string): Promise<TeamSummaryDto[]>;
    getById(id: string, requestUserId?: string): Promise<TeamDetailDto>;
    create(userId: string, dto: CreateTeamDto): Promise<TeamDetailDto>;
    join(teamId: string, userId: string): Promise<TeamDetailDto>;
}
