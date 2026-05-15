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
exports.PartnerInterestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const partner_interest_constants_1 = require("../../../common/constants/partner-interest.constants");
class PartnerInterestDto {
    turfName;
    city;
    contactNumber;
    email;
    notes;
    source;
}
exports.PartnerInterestDto = PartnerInterestDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PartnerInterestDto.prototype, "turfName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hyderabad' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PartnerInterestDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+919800000000' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[+0-9][0-9\s-]{8,18}$/),
    __metadata("design:type", String)
], PartnerInterestDto.prototype, "contactNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], PartnerInterestDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional message from the venue owner', maxLength: 2000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], PartnerInterestDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['WEB_FORM', 'BOOK_PAGE', 'TURF_DETAIL', 'REFERRAL', 'OTHER'],
        description: 'Attribution for analytics; omit for WEB_FORM',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(partner_interest_constants_1.PARTNER_INTEREST_SOURCE_LIST),
    __metadata("design:type", String)
], PartnerInterestDto.prototype, "source", void 0);
//# sourceMappingURL=partner-interest.dto.js.map