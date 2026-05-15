import { GameMode } from '../../common/enums/game-mode.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { PlayerCardDto } from './dto/player-card.dto';
export declare class PlayerCardsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMine(userId: string, mode?: GameMode): Promise<PlayerCardDto>;
    getPublic(userId: string, mode?: GameMode): Promise<PlayerCardDto>;
    private loadCard;
}
