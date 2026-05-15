import { CityLeaderboardQueryDto, NationalLeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { LeaderboardRowDto } from './dto/leaderboard-row.dto';
import { LeaderboardsService } from './leaderboards.service';
export declare class LeaderboardsController {
    private readonly leaderboardsService;
    constructor(leaderboardsService: LeaderboardsService);
    city(query: CityLeaderboardQueryDto): Promise<LeaderboardRowDto[]>;
    national(query: NationalLeaderboardQueryDto): Promise<LeaderboardRowDto[]>;
}
