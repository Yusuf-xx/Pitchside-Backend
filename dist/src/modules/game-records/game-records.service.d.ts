import { PrismaService } from '../../prisma/prisma.service';
import { RateTeammateDto } from './dto/rate-teammate.dto';
import { GameRecordResponseDto } from './dto/game-record-response.dto';
export declare class GameRecordsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getByGame(gameId: string, viewerUserId: string): Promise<GameRecordResponseDto>;
    submitRatings(gameId: string, viewerUserId: string, rows: RateTeammateDto[]): Promise<GameRecordResponseDto>;
    private buildResponse;
}
