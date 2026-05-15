import type { RequestWithOptionalUser } from '../auth/guards/optional-jwt-auth.guard';
import { HomeDashboardQueryDto } from './dto/home-dashboard-query.dto';
import { HomeDashboardDto } from './dto/home-dashboard.dto';
import { HomeService } from './home.service';
export declare class HomeController {
    private readonly homeService;
    constructor(homeService: HomeService);
    dashboard(query: HomeDashboardQueryDto, req: RequestWithOptionalUser): Promise<HomeDashboardDto>;
}
