"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminFeedController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_access_guard_1 = require("../../common/guards/admin-access.guard");
const feed_admin_service_1 = require("./feed-admin.service");
const create_feed_event_dto_1 = require("./dto/create-feed-event.dto");
const feed_event_created_dto_1 = require("./dto/feed-event-created.dto");
let AdminFeedController = class AdminFeedController {
    feedAdmin;
    constructor(feedAdmin) {
        this.feedAdmin = feedAdmin;
    }
    createFeedEvent(dto) {
        return this.feedAdmin.create(dto);
    }
};
exports.AdminFeedController = AdminFeedController;
__decorate([
    (0, common_1.Post)('feed-events'),
    (0, common_1.UseGuards)(admin_access_guard_1.AdminAccessGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Create home feed item',
        description: 'Requires admin auth: header X-Admin-Key matching ADMIN_API_KEY, or Bearer JWT for an email in ADMIN_EMAILS.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: feed_event_created_dto_1.FeedEventCreatedDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Admin authentication failed or account is not allowlisted' }),
    (0, swagger_1.ApiServiceUnavailableResponse)({ description: 'Admin access not configured (set ADMIN_EMAILS and/or ADMIN_API_KEY)' }),
    (0, swagger_1.ApiTooManyRequestsResponse)({ description: 'Too many admin requests. Try again later.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_feed_event_dto_1.CreateFeedEventDto]),
    __metadata("design:returntype", Promise)
], AdminFeedController.prototype, "createFeedEvent", null);
exports.AdminFeedController = AdminFeedController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiHeader)({
        name: 'X-Admin-Key',
        required: false,
        description: 'Alternative to JWT when ADMIN_API_KEY is set',
    }),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [feed_admin_service_1.FeedAdminService])
], AdminFeedController);
//# sourceMappingURL=admin-feed.controller.js.map