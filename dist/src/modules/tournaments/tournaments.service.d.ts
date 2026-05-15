import { PrismaService } from '../../prisma/prisma.service';
import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import { CreateTournamentRegistrationDto } from './dto/create-tournament-registration.dto';
import { MyTournamentRegistrationDto } from './dto/my-tournament-registration.dto';
import { TournamentStandingsDto } from './dto/tournament-standings.dto';
import { TournamentSummaryDto } from './dto/tournament-summary.dto';
export declare class TournamentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(query: ModeCityQueryDto): Promise<TournamentSummaryDto[]>;
    getById(id: string): Promise<TournamentSummaryDto>;
    standings(id: string): Promise<TournamentStandingsDto>;
    listMyRegistrations(userId: string): Promise<MyTournamentRegistrationDto[]>;
    register(tournamentId: string, userId: string, dto: CreateTournamentRegistrationDto): Promise<TournamentSummaryDto>;
}
