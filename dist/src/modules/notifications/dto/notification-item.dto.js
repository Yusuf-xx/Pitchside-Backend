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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class NotificationItemDto {
    id;
    type;
    title;
    body;
    createdAt;
    read;
    readAt;
    actionPath;
}
exports.NotificationItemDto = NotificationItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Machine category for clients (e.g. GENERIC, BOOKING, GAME)' }),
    __metadata("design:type", String)
], NotificationItemDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationItemDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationItemDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], NotificationItemDto.prototype, "read", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ISO time when marked read' }),
    __metadata("design:type", String)
], NotificationItemDto.prototype, "readAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'In-app path for navigation, e.g. /games/cuid (optional)',
    }),
    __metadata("design:type", String)
], NotificationItemDto.prototype, "actionPath", void 0);
//# sourceMappingURL=notification-item.dto.js.map