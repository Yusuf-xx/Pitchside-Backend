import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaderboardRowDto } from './dto/leaderboard-row.dto';
export declare class LeaderboardsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    city(city: string, mode: GameMode): Promise<LeaderboardRowDto[]>;
    national(mode: GameMode): Promise<LeaderboardRowDto[]>;
}
