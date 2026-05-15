import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AddSquadMemberDto } from './dto/add-squad-member.dto';
import { CreateSquadDto } from './dto/create-squad.dto';
import { SquadSummaryDto } from './dto/squad-summary.dto';
export declare class SquadsService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    create(userId: string, dto: CreateSquadDto): Promise<SquadSummaryDto>;
    listMine(userId: string): Promise<SquadSummaryDto[]>;
    getById(squadId: string, userId: string): Promise<SquadSummaryDto>;
    addMember(squadId: string, actorUserId: string, dto: AddSquadMemberDto): Promise<SquadSummaryDto>;
    inviteSquadToGame(gameId: string, hostUserId: string, squadId: string): Promise<void>;
    private requireSquadForMember;
    private requireCaptain;
    private mapSquad;
}
