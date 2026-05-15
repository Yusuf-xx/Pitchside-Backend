declare const STATUSES: readonly ["OPEN", "APPROVED", "REJECTED", "ALL"];
export declare class ListAppealsQueryDto {
    status?: (typeof STATUSES)[number];
}
export {};
