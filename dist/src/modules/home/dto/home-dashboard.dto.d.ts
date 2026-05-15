import { GameMode } from '../../../common/enums/game-mode.enum';
import { GameSummaryDto } from '../../games/dto/game-summary.dto';
import { TurfSummaryDto } from '../../turfs/dto/turf-summary.dto';
import { FeedItemDto, TournamentTeaserDto } from './home-feed.dto';
export declare class HomeDashboardDto {
    greetingName: string;
    city: string;
    gameMode: GameMode;
    playerOvr?: number;
    nearbyGames: GameSummaryDto[];
    needPlayersAlerts: GameSummaryDto[];
    nextMatch?: GameSummaryDto | null;
    tournamentTeasers: TournamentTeaserDto[];
    feed: FeedItemDto[];
    nearbyTurfs: TurfSummaryDto[];
}
