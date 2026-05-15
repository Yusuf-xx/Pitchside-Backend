import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SquadsService } from '../squads/squads.service';
import { CreateGameDto } from './dto/create-game.dto';
import { GameSummaryDto } from './dto/game-summary.dto';
import { MatchHistoryQueryDto, MatchHistoryResponseDto } from './dto/match-history.dto';
export declare class GamesService {
    private readonly prisma;
    private readonly notifications;
    private readonly squads;
    constructor(prisma: PrismaService, notifications: NotificationsService, squads: SquadsService);
    private baseWhere;
    list(query: ModeCityQueryDto): Promise<GameSummaryDto[]>;
    needPlayers(query: ModeCityQueryDto): Promise<GameSummaryDto[]>;
    getById(id: string, viewerUserId?: string): Promise<GameSummaryDto>;
    join(gameId: string, userId: string): Promise<GameSummaryDto>;
    leave(gameId: string, userId: string): Promise<GameSummaryDto>;
    create(dto: CreateGameDto, hostUserId: string): Promise<GameSummaryDto>;
    inviteSquad(gameId: string, hostUserId: string, squadId: string): Promise<void>;
    shuffleTeams(gameId: string, hostUserId: string): Promise<GameSummaryDto>;
    updateBalancedTeams(gameId: string, hostUserId: string, body: {
        teamA: string[];
        teamB: string[];
    }): Promise<GameSummaryDto>;
    completeGame(gameId: string, hostUserId: string, body: import('./dto/complete-game.dto').CompleteGameDto): Promise<GameSummaryDto>;
    submitFeedbackTags(gameId: string, fromUserId: string, body: {
        toUserId: string;
        tagKey: string;
        isPositive: boolean;
    }): Promise<void>;
    markAttendance(gameId: string, hostUserId: string, body: {
        entries: {
            userId: string;
            attended: boolean;
        }[];
    }): Promise<GameSummaryDto>;
    selfAttendanceQr(gameId: string, userId: string, token: string): Promise<GameSummaryDto>;
    private applyNegativeTagPenalty;
    private bumpPhy;
    private requireHostConfirmed;
    private maybeConfirmGame;
    private rebalanceTeams;
    private orderedPair;
    private applyRivalryDeltas;
    getMatchHistory(subjectUserId: string, query: MatchHistoryQueryDto): Promise<MatchHistoryResponseDto>;
}
