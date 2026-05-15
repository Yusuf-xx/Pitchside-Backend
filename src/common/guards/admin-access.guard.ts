import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtSecret } from '../../modules/auth/auth.constants';
import type { JwtPayload } from '../../modules/auth/strategies/jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';

export type AdminRequestAccess =
  | { type: 'api_key' }
  | { type: 'jwt'; userId: string; email: string };

export type RequestWithAdmin = Request & {
  adminAccess?: AdminRequestAccess;
};

/**
 * Production ops: set `ADMIN_API_KEY` (rotate regularly) and/or comma-separated `ADMIN_EMAILS`
 * (must match registered user emails). Requests may use header `X-Admin-Key: <key>` OR Bearer JWT
 * for an allowlisted account.
 */
@Injectable()
export class AdminAccessGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithAdmin>();
    const envKey = process.env.ADMIN_API_KEY?.trim();
    const headerKey =
      typeof req.headers['x-admin-key'] === 'string' ? req.headers['x-admin-key'].trim() : undefined;

    if (envKey && headerKey === envKey) {
      req.adminAccess = { type: 'api_key' };
      return true;
    }

    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new ForbiddenException('Admin authentication required');
    }
    const token = auth.slice(7).trim();
    let payload: JwtPayload;
    try {
      payload = this.jwt.verify<JwtPayload>(token, { secret: jwtSecret() });
    } catch {
      throw new ForbiddenException('Invalid token');
    }
    if (payload.type !== 'access') {
      throw new ForbiddenException('Invalid admin token type');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const allowlist = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (allowlist.length === 0 && !envKey) {
      throw new ServiceUnavailableException(
        'Admin access is not configured (set ADMIN_EMAILS and/or ADMIN_API_KEY)',
      );
    }

    if (!allowlist.includes(user.email.toLowerCase())) {
      throw new ForbiddenException('Not an admin');
    }

    req.adminAccess = { type: 'jwt', userId: user.id, email: user.email };
    return true;
  }
}
