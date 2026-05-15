export declare class CompleteGameParticipantStatDto {
    userId: string;
    goals?: number;
    assists?: number;
    wickets?: number;
}
export declare class CompleteGameDto {
    winnerSide: 'A' | 'B' | 'DRAW';
    participantStats?: CompleteGameParticipantStatDto[];
}
