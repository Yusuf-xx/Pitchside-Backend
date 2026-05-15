import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { GamesService } from '../games/games.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { TurfsService } from '../turfs/turfs.service';
import { HomeDashboardDto } from './dto/home-dashboard.dto';
type DashboardOpts = {
    userId?: string;
    city?: string;
    gameMode?: GameMode;
};
export declare class HomeService {
    private readonly prisma;
    private readonly gamesService;
    private readonly turfsService;
    private readonly tournamentsService;
    constructor(prisma: PrismaService, gamesService: GamesService, turfsService: TurfsService, tournamentsService: TournamentsService);
    getDashboard(opts: DashboardOpts): Promise<HomeDashboardDto>;
}
export {};
