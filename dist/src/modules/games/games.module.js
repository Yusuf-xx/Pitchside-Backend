"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const notifications_module_1 = require("../notifications/notifications.module");
const squads_module_1 = require("../squads/squads.module");
const games_controller_1 = require("./games.controller");
const games_engagement_digest_service_1 = require("./games-engagement-digest.service");
const games_lifecycle_service_1 = require("./games-lifecycle.service");
const games_recap_nudge_service_1 = require("./games-recap-nudge.service");
const games_service_1 = require("./games.service");
const recap_service_1 = require("./recap.service");
let GamesModule = class GamesModule {
};
exports.GamesModule = GamesModule;
exports.GamesModule = GamesModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, notifications_module_1.NotificationsModule, squads_module_1.SquadsModule],
        controllers: [games_controller_1.GamesController],
        providers: [
            games_service_1.GamesService,
            games_lifecycle_service_1.GamesLifecycleService,
            games_recap_nudge_service_1.GamesRecapNudgeService,
            games_engagement_digest_service_1.GamesEngagementDigestService,
            recap_service_1.RecapService,
        ],
        exports: [games_service_1.GamesService],
    })
], GamesModule);
//# sourceMappingURL=games.module.js.map