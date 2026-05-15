import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { jwtSecret } from '../auth.constants';
import type { JwtPayload } from '../strategies/jwt.strategy';

export type RequestWithOptionalUser = Request & { user?: { userId: string } };

/**
 * Attaches `req.user` when a valid Bearer access token is present and session is active; otherwise continues as guest.
 */
@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithOptionalUser>();
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return true;
    }
    const token = header.slice(7).trim();
    if (!token) {
      return true;
    }
    try {
      const payload = this.jwt.verify<JwtPayload>(token, { secret: jwtSecret() });
      if (payload.type !== 'access') {
        return true;
      }
      if (typeof payload.sv !== 'number' || !Number.isInteger(payload.sv) || payload.sv < 0) {
        return true;
      }
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, sessionVersion: true },
      });
      if (!user || user.sessionVersion !== payload.sv) {
        return true;
      }
      req.user = { userId: user.id };
    } catch {
      /* invalid token — continue as guest */
    }
    return true;
  }
}
