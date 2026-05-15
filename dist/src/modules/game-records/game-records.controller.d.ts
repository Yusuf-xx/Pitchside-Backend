import { GameRecordResponseDto } from './dto/game-record-response.dto';
import { SubmitRatingsDto } from './dto/submit-ratings.dto';
import { GameRecordsService } from './game-records.service';
export declare class GameRecordsController {
    private readonly gameRecordsService;
    constructor(gameRecordsService: GameRecordsService);
    getByGame(gameId: string, user: {
        userId: string;
    }): Promise<GameRecordResponseDto>;
    submitRatings(gameId: string, user: {
        userId: string;
    }, dto: SubmitRatingsDto): Promise<GameRecordResponseDto>;
}
