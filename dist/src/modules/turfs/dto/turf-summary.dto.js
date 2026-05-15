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
exports.TurfSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class TurfSummaryDto {
    id;
    name;
    modes;
    footballVenueSubFormats;
    area;
    city;
    rating;
    reviewCount;
    priceInrPerHour;
    partner;
    availabilityNote;
}
exports.TurfSummaryDto = TurfSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TurfSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TurfSummaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode, isArray: true }),
    __metadata("design:type", Array)
], TurfSummaryDto.prototype, "modes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Football venue sub-format tags when applicable' }),
    __metadata("design:type", Array)
], TurfSummaryDto.prototype, "footballVenueSubFormats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TurfSummaryDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TurfSummaryDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TurfSummaryDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TurfSummaryDto.prototype, "reviewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'INR per hour' }),
    __metadata("design:type", Number)
], TurfSummaryDto.prototype, "priceInrPerHour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], TurfSummaryDto.prototype, "partner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TurfSummaryDto.prototype, "availabilityNote", void 0);
//# sourceMappingURL=turf-summary.dto.js.map