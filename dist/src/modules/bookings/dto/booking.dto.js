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
exports.BookingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class BookingDto {
    id;
    turfId;
    turfName;
    gameMode;
    date;
    slots;
    totalInr;
    splitPayment;
    status;
    createdAt;
}
exports.BookingDto = BookingDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BookingDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BookingDto.prototype, "turfId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BookingDto.prototype, "turfName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    __metadata("design:type", String)
], BookingDto.prototype, "gameMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BookingDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], BookingDto.prototype, "slots", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BookingDto.prototype, "totalInr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BookingDto.prototype, "splitPayment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BookingDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ISO timestamp when the booking was created' }),
    __metadata("design:type", String)
], BookingDto.prototype, "createdAt", void 0);
//# sourceMappingURL=booking.dto.js.map