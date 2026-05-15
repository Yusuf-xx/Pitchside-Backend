import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WaitlistSignupDto } from './dto/waitlist-signup.dto';
import { WaitlistSignupResponseDto } from './dto/waitlist-signup-response.dto';

@Injectable()
export class WaitlistService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(dto: WaitlistSignupDto): Promise<WaitlistSignupResponseDto> {
    const email = dto.email.trim().toLowerCase();
    try {
      const row = await this.prisma.waitlistSignup.create({
        data: {
          program: dto.program,
          email,
          city: dto.city?.trim() || null,
        },
      });
      return {
        id: row.id,
        createdAt: row.createdAt.toISOString(),
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('This email is already on this waitlist');
      }
      throw e;
    }
  }
}
