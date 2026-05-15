import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;
  const userFindUnique = jest.fn();

  beforeAll(() => {
    process.env.JWT_SECRET = 'unit-test-jwt-secret-min-32-chars!!';
    process.env.ACCESS_TOKEN_TTL_SEC = '3600';
    process.env.REFRESH_TOKEN_TTL_SEC = '7200';
  });

  beforeEach(async () => {
    userFindUnique.mockReset();
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET!,
          signOptions: { expiresIn: '3600s' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: userFindUnique,
              findUniqueOrThrow: jest.fn().mockResolvedValue({ id: 'u1', sessionVersion: 0 }),
              update: jest.fn(),
              create: jest.fn(),
            },
            passwordResetToken: {
              findUnique: jest.fn(),
              updateMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    jwt = moduleRef.get(JwtService);
  });

  it('refresh rejects when sessionVersion no longer matches token', async () => {
    userFindUnique.mockResolvedValue({ id: 'u1', sessionVersion: 5 });
    const stale = jwt.sign(
      { sub: 'u1', type: 'refresh', sv: 4 },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );
    await expect(service.refresh({ refreshToken: stale })).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
