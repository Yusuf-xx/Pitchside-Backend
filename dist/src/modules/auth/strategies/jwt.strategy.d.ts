import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
export type JwtPayload = {
    sub: string;
    type: 'access' | 'refresh';
    sv: number;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
    }>;
}
export {};
