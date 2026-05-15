import type { RequestWithOptionalUser } from '../auth/guards/optional-jwt-auth.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamDetailDto } from './dto/team-detail.dto';
import { TeamSummaryDto } from './dto/team-summary.dto';
import { TeamsService } from './teams.service';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    listMine(user: {
        userId: string;
    }): Promise<TeamSummaryDto[]>;
    create(user: {
        userId: string;
    }, dto: CreateTeamDto): Promise<TeamDetailDto>;
    join(id: string, user: {
        userId: string;
    }): Promise<TeamDetailDto>;
    getById(id: string, req: RequestWithOptionalUser): Promise<TeamDetailDto>;
}
