import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { PartnerInterestSource } from '../../common/constants/partner-interest.constants';
import { PARTNER_INTEREST_SOURCES } from '../../common/constants/partner-interest.constants';
import { PrismaService } from '../../prisma/prisma.service';
import { PartnerInterestDto } from './dto/partner-interest.dto';
import { PartnerInterestResponseDto } from './dto/partner-interest-response.dto';
import { PartnerTurfInterestDetailDto } from './dto/partner-turf-interest-detail.dto';
import { UpdatePartnerTurfInterestDto } from './dto/update-partner-turf-interest.dto';

function resolveSource(raw?: string): PartnerInterestSource {
  const v = raw?.trim();
  if (v && (PARTNER_INTEREST_SOURCES as readonly string[]).includes(v)) {
    return v as PartnerInterestSource;
  }
  return 'WEB_FORM';
}

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async submitTurfInterest(dto: PartnerInterestDto): Promise<PartnerInterestResponseDto> {
    const email = dto.email.trim().toLowerCase();
    const turfName = dto.turfName.trim();
    const city = dto.city.trim();
    const contactNumber = dto.contactNumber.trim().replace(/\s+/g, ' ');
    const notes = dto.notes?.trim() ? dto.notes.trim().slice(0, 2000) : null;
    const source = resolveSource(dto.source);

    try {
      const row = await this.prisma.partnerTurfInterest.create({
        data: {
          email,
          turfName,
          city,
          contactNumber,
          notes,
          source,
        },
      });
      return {
        id: row.id,
        createdAt: row.createdAt.toISOString(),
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'We already have this venue signup — try another email or adjust turf name/city if it was a typo.',
        );
      }
      throw e;
    }
  }

  async updateTurfInterest(id: string, dto: UpdatePartnerTurfInterestDto): Promise<PartnerTurfInterestDetailDto> {
    const row = await this.prisma.partnerTurfInterest.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Partner interest not found');
    }

    const hasChange =
      dto.status !== undefined ||
      dto.assignedToUserId !== undefined ||
      dto.notes !== undefined;
    if (!hasChange) {
      throw new BadRequestException('No fields to update');
    }

    if (dto.assignedToUserId !== undefined && dto.assignedToUserId !== null) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: dto.assignedToUserId },
      });
      if (!assignee) {
        throw new BadRequestException('Assignee user not found');
      }
    }

    const notes =
      dto.notes !== undefined
        ? dto.notes === null || dto.notes.trim() === ''
          ? null
          : dto.notes.trim().slice(0, 4000)
        : undefined;

    const updated = await this.prisma.partnerTurfInterest.update({
      where: { id },
      data: {
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.assignedToUserId !== undefined
          ? { assignedToUserId: dto.assignedToUserId }
          : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return {
      id: updated.id,
      turfName: updated.turfName,
      city: updated.city,
      contactNumber: updated.contactNumber,
      email: updated.email,
      status: updated.status,
      assignedToUserId: updated.assignedToUserId,
      notes: updated.notes,
      source: updated.source,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}
