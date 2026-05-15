import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
export type RequestWithOptionalUser = Request & {
    user?: {
        userId: string;
    };
};
export declare class OptionalJwtAuthGuard implements CanActivate {
    private readonly jwt;
    private readonly prisma;
    constructor(jwt: JwtService, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
