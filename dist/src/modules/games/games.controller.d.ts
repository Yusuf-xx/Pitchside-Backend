import { ModeCityQueryDto } from '../../common/dto/mode-city-query.dto';
import type { RequestWithOptionalUser } from '../auth/guards/optional-jwt-auth.guard';
import { CreateGameDto } from './dto/create-game.dto';
import { CompleteGameDto } from './dto/complete-game.dto';
import { FeedbackTagDto } from './dto/feedback-tag.dto';
import { InviteSquadDto } from './dto/invite-squad.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { QrSelfAttendanceDto } from './dto/qr-self.dto';
import { GameSummaryDto } from './dto/game-summary.dto';
import { MatchHistoryQueryDto, MatchHistoryResponseDto } from './dto/match-history.dto';
import { UpdateBalancedTeamsDto } from './dto/update-balanced-teams.dto';
import { GamesService } from './games.service';
import { RecapService } from './recap.service';
export declare class GamesController {
    private readonly gamesService;
    private readonly recapService;
    constructor(gamesService: GamesService, recapService: RecapService);
    list(query: ModeCityQueryDto): Promise<GameSummaryDto[]>;
    needPlayers(query: ModeCityQueryDto): Promise<GameSummaryDto[]>;
    join(user: {
        userId: string;
    }, id: string): Promise<GameSummaryDto>;
    leave(user: {
        userId: string;
    }, id: string): Promise<GameSummaryDto>;
    inviteSquad(user: {
        userId: string;
    }, id: string, dto: InviteSquadDto): Promise<void>;
    shuffleTeams(user: {
        userId: string;
    }, id: string): Promise<GameSummaryDto>;
    complete(user: {
        userId: string;
    }, id: string, dto: CompleteGameDto): Promise<GameSummaryDto>;
    feedbackTag(user: {
        userId: string;
    }, id: string, dto: FeedbackTagDto): Promise<void>;
    markAttendance(user: {
        userId: string;
    }, id: string, dto: MarkAttendanceDto): Promise<GameSummaryDto>;
    selfAttendance(user: {
        userId: string;
    }, id: string, dto: QrSelfAttendanceDto): Promise<GameSummaryDto>;
    updateBalancedTeams(user: {
        userId: string;
    }, id: string, dto: UpdateBalancedTeamsDto): Promise<GameSummaryDto>;
    myRecap(user: {
        userId: string;
    }, year?: string, half?: string): Promise<{
        periodKey: string;
        payload: Record<string, unknown>;
    }>;
    matchHistory(userId: string, query: MatchHistoryQueryDto): Promise<MatchHistoryResponseDto>;
    getById(id: string, req: RequestWithOptionalUser): Promise<GameSummaryDto>;
    create(user: {
        userId: string;
    }, dto: CreateGameDto): Promise<GameSummaryDto>;
}
