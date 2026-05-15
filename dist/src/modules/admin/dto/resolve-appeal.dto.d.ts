declare const DECISIONS: readonly ["APPROVE", "REJECT"];
export declare class ResolveAppealDto {
    decision: (typeof DECISIONS)[number];
    moderatorNote?: string;
}
export {};
