import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { RequestWithAdmin } from '../../common/guards/admin-access.guard';
import { NotificationsService } from '../notifications/notifications.service';
import { AdminAppealItemDto } from './dto/admin-appeal-item.dto';
import { ListAppealsQueryDto } from './dto/list-appeals-query.dto';
import { ResolveAppealDto } from './dto/resolve-appeal.dto';

@Injectable()
export class AdminAppealsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async list(query: ListAppealsQueryDto): Promise<AdminAppealItemDto[]> {
    const status = query.status ?? 'OPEN';
    const rows = await this.prisma.attendanceRestrictionAppeal.findMany({
      where: status === 'ALL' ? {} : { status },
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        user: {
          include: {
            profile: { select: { displayName: true } },
          },
        },
      },
    });
    return rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      displayName: r.user.profile?.displayName?.trim() || 'Player',
      message: r.message,
      status: r.status,
      moderatorNote: r.moderatorNote ?? undefined,
      reviewedAt: r.reviewedAt?.toISOString(),
      reviewedByUserId: r.reviewedByUserId ?? undefined,
      reviewedByLabel: r.reviewedByLabel ?? undefined,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async resolve(id: string, dto: ResolveAppealDto, req: RequestWithAdmin): Promise<AdminAppealItemDto> {
    const appeal = await this.prisma.attendanceRestrictionAppeal.findUnique({
      where: { id },
      include: {
        user: {
          include: { profile: { select: { displayName: true } } },
        },
      },
    });
    if (!appeal) throw new NotFoundException('Appeal not found');
    if (appeal.status !== 'OPEN') {
      throw new BadRequestException('Appeal is already resolved');
    }

    const meta = this.reviewerMeta(req);
    const now = new Date();
    const note = dto.moderatorNote?.trim() || undefined;

    if (dto.decision === 'APPROVE') {
      await this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: appeal.userId },
          data: { joinRestrictedUntil: null },
        });
        await tx.attendanceRestrictionAppeal.updateMany({
          where: { userId: appeal.userId, status: 'OPEN', NOT: { id: appeal.id } },
          data: {
            status: 'REJECTED',
            reviewedAt: now,
            reviewedByUserId: meta.userId ?? null,
            reviewedByLabel: meta.label,
            moderatorNote: 'Closed automatically when another appeal for this player was approved.',
          },
        });
        await tx.attendanceRestrictionAppeal.update({
          where: { id: appeal.id },
          data: {
            status: 'APPROVED',
            moderatorNote: note,
            reviewedAt: now,
            reviewedByUserId: meta.userId ?? null,
            reviewedByLabel: meta.label,
          },
        });
      });
      void this.notifications
        .createForUser(appeal.userId, {
          type: 'APPEAL_APPROVED',
          title: 'Join restriction lifted',
          body:
            'Your appeal was approved. You can join pickup games again. Keep attendance strong so hosts can rely on you.',
          actionPath: '/games',
        })
        .catch(() => undefined);
    } else {
      await this.prisma.attendanceRestrictionAppeal.update({
        where: { id: appeal.id },
        data: {
          status: 'REJECTED',
          moderatorNote: note,
          reviewedAt: now,
          reviewedByUserId: meta.userId ?? null,
          reviewedByLabel: meta.label,
        },
      });
      void this.notifications
        .createForUser(appeal.userId, {
          type: 'APPEAL_REJECTED',
          title: 'Appeal decision',
          body:
            note != null && note.length > 0
              ? `Your join-restriction appeal was not approved. Note: ${note}`
              : 'Your join-restriction appeal was not approved. Improve attendance at confirmed games and try again later.',
          actionPath: '/card',
        })
        .catch(() => undefined);
    }

    const updated = await this.prisma.attendanceRestrictionAppeal.findUnique({
      where: { id },
      include: { user: { include: { profile: { select: { displayName: true } } } } },
    });
    if (!updated) throw new NotFoundException('Appeal not found');
    return {
      id: updated.id,
      userId: updated.userId,
      displayName: updated.user.profile?.displayName?.trim() || 'Player',
      message: updated.message,
      status: updated.status,
      moderatorNote: updated.moderatorNote ?? undefined,
      reviewedAt: updated.reviewedAt?.toISOString(),
      reviewedByUserId: updated.reviewedByUserId ?? undefined,
      reviewedByLabel: updated.reviewedByLabel ?? undefined,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  private reviewerMeta(req: RequestWithAdmin): { userId?: string; label: string } {
    const a = req.adminAccess;
    if (!a) {
      return { label: 'unknown' };
    }
    if (a.type === 'api_key') {
      return { label: 'admin-api-key' };
    }
    return { userId: a.userId, label: a.email };
  }
}
