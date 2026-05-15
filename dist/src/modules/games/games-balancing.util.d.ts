export type SideSplit = {
    A: string[];
    B: string[];
};
export declare function balanceSides(gameMode: string, userIds: string[], positionByUser: Map<string, string>): SideSplit;
