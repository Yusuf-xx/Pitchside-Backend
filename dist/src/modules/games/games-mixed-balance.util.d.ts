import { type SideSplit } from './games-balancing.util';
export declare function balanceSidesMixed(gameMode: string, userIds: string[], positionByUser: Map<string, string>, womanUserIds: readonly string[], minWomenPerTeam: number): SideSplit;
