import { GameMode } from '../../../common/enums/game-mode.enum';
import { GameRecordPhase } from '../../../common/enums/game-record-phase.enum';
import { GameRecordMyRatingDto } from './game-record-my-rating.dto';
import { GameRecordParticipantDto } from './game-record-participant.dto';
import { GameRecordPeerSummaryDto } from './game-record-peer-summary.dto';
import { GameRecordReceivedSummaryDto } from './game-record-received-summary.dto';
export declare class GameRecordResponseDto {
    gameId: string;
    gameMode: GameMode;
    title: string;
    venueName: string;
    city: string;
    startsAt: string;
    phase: GameRecordPhase;
    participants: GameRecordParticipantDto[];
    myRatings: GameRecordMyRatingDto[];
    peerSummaries: GameRecordPeerSummaryDto[];
    receivedSummary: GameRecordReceivedSummaryDto | null;
}
