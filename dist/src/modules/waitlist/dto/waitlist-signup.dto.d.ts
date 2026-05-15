export declare enum WaitlistProgram {
    SCOUT_MODE = "SCOUT_MODE"
}
export declare class WaitlistSignupDto {
    program: WaitlistProgram;
    email: string;
    city?: string;
}
