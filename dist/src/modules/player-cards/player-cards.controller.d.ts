import { GameMode } from '../../common/enums/game-mode.enum';
import { PlayerCardDto } from './dto/player-card.dto';
import { PlayerCardsService } from './player-cards.service';
export declare class PlayerCardsController {
    private readonly playerCardsService;
    constructor(playerCardsService: PlayerCardsService);
    getMine(user: {
        userId: string;
    }, mode?: GameMode): Promise<PlayerCardDto>;
    getByUser(userId: string, mode?: GameMode): Promise<PlayerCardDto>;
}
