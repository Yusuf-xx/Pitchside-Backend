import { PrismaService } from '../../prisma/prisma.service';
import { TrainingStatusDto } from './dto/training-status.dto';
import type { GpsDto } from './dto/gps.dto';
export declare class TrainingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getOrCreateSettings;
    getStatus(userId: string): Promise<TrainingStatusDto>;
    private computeStreakDays;
    clockIn(userId: string, gps?: GpsDto): Promise<TrainingStatusDto>;
    clockOut(userId: string): Promise<TrainingStatusDto>;
    updateWeeklyGoal(userId: string, weeklyGoalMinutes: number): Promise<TrainingStatusDto>;
}
