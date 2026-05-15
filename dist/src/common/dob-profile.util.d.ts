export declare function parseLocalYmd(ymd: string): Date | null;
export declare function startOfLocalDay(d: Date): Date;
export declare function fullYearsBetween(dob: Date, ref: Date): number;
export declare function latestDobForMinAge(minAge: number, ref: Date): Date;
export type ProfileDobErrorCode = 'INVALID_DATE' | 'DOB_NOT_BEFORE_TODAY' | 'TOO_YOUNG' | 'TOO_OLD';
export declare function validateProfileDobYmd(dobIso: string, now?: Date): ProfileDobErrorCode | null;
export declare function profileDobErrorMessage(code: ProfileDobErrorCode): string;
export declare function formatLocalYmd(d: Date): string;
export declare function profileDobInputBounds(now?: Date): {
    min: string;
    max: string;
};
