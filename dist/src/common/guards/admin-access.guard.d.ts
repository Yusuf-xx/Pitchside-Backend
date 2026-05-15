import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
export type AdminRequestAccess = {
    type: 'api_key';
} | {
    type: 'jwt';
    userId: string;
    email: string;
};
export type RequestWithAdmin = Request & {
    adminAccess?: AdminRequestAccess;
};
export declare class AdminAccessGuard implements CanActivate {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
