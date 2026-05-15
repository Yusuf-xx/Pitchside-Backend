import { AddSquadMemberDto } from './dto/add-squad-member.dto';
import { CreateSquadDto } from './dto/create-squad.dto';
import { SquadSummaryDto } from './dto/squad-summary.dto';
import { SquadsService } from './squads.service';
export declare class SquadsController {
    private readonly squads;
    constructor(squads: SquadsService);
    create(user: {
        userId: string;
    }, dto: CreateSquadDto): Promise<SquadSummaryDto>;
    listMine(user: {
        userId: string;
    }): Promise<SquadSummaryDto[]>;
    getById(user: {
        userId: string;
    }, id: string): Promise<SquadSummaryDto>;
    addMember(user: {
        userId: string;
    }, id: string, dto: AddSquadMemberDto): Promise<SquadSummaryDto>;
}
