export declare const TRAINING_TIME_ZONE = "Asia/Kolkata";
export declare const DAY_MS: number;
export declare function getIstYmdParts(d: Date): {
    year: number;
    month: number;
    day: number;
};
export declare function istDateKey(d: Date): string;
export declare function istWallMidnight(year: number, month: number, day: number): Date;
export declare function startOfIstIsoWeek(now: Date): Date;
export declare function addIstDaysFromMidnight(istMidnight: Date, deltaDays: number): Date;
