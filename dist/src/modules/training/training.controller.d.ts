import { GpsDto } from './dto/gps.dto';
import { PatchTrainingGoalDto } from './dto/patch-training-goal.dto';
import { TrainingStatusDto } from './dto/training-status.dto';
import { TrainingService } from './training.service';
export declare class TrainingController {
    private readonly trainingService;
    constructor(trainingService: TrainingService);
    status(user: {
        userId: string;
    }): Promise<TrainingStatusDto>;
    clockIn(user: {
        userId: string;
    }, body: GpsDto): Promise<TrainingStatusDto>;
    clockOut(user: {
        userId: string;
    }): Promise<TrainingStatusDto>;
    patchGoal(user: {
        userId: string;
    }, dto: PatchTrainingGoalDto): Promise<TrainingStatusDto>;
}
