import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../../prisma/prisma.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  const findUnique = jest.fn();

  beforeAll(() => {
    process.env.JWT_SECRET = 'unit-test-jwt-secret-min-32-chars!!';
  });

  beforeEach(async () => {
    findUnique.mockReset();
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique },
          },
        },
      ],
    }).compile();

    strategy = moduleRef.get(JwtStrategy);
  });

  it('rejects when sessionVersion does not match token sv', async () => {
    findUnique.mockResolvedValue({ id: 'u1', sessionVersion: 2 });
    await expect(
      strategy.validate({ sub: 'u1', type: 'access', sv: 1 } as never),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('accepts when sessionVersion matches', async () => {
    findUnique.mockResolvedValue({ id: 'u1', sessionVersion: 3 });
    await expect(strategy.validate({ sub: 'u1', type: 'access', sv: 3 } as never)).resolves.toEqual({
      userId: 'u1',
    });
  });
});
