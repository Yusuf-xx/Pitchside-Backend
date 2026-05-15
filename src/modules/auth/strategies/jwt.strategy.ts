import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from '../auth.constants';
import { PrismaService } from '../../../prisma/prisma.service';

export type JwtPayload = { sub: string; type: 'access' | 'refresh'; sv: number };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret(),
    });
  }

  async validate(payload: JwtPayload): Promise<{ userId: string }> {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid access token');
    }
    if (typeof payload.sv !== 'number' || !Number.isInteger(payload.sv) || payload.sv < 0) {
      throw new UnauthorizedException('Invalid access token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, sessionVersion: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.sessionVersion !== payload.sv) {
      throw new UnauthorizedException('Session expired');
    }
    return { userId: user.id };
  }
}
