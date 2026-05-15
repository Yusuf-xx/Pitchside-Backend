"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_access_guard_1 = require("../../common/guards/admin-access.guard");
const notifications_module_1 = require("../notifications/notifications.module");
const admin_appeals_controller_1 = require("./admin-appeals.controller");
const admin_appeals_service_1 = require("./admin-appeals.service");
const admin_feed_controller_1 = require("./admin-feed.controller");
const feed_admin_service_1 = require("./feed-admin.service");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        controllers: [admin_feed_controller_1.AdminFeedController, admin_appeals_controller_1.AdminAppealsController],
        providers: [admin_access_guard_1.AdminAccessGuard, feed_admin_service_1.FeedAdminService, admin_appeals_service_1.AdminAppealsService],
        exports: [admin_access_guard_1.AdminAccessGuard],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map