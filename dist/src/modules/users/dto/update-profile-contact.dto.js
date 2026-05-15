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
exports.UpdateProfileContactDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateProfileContactDto {
    phoneE164;
}
exports.UpdateProfileContactDto = UpdateProfileContactDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'E.164 phone (e.g. +919876543210) for squad/friend lookup. Empty string clears.',
        example: '+919876543210',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.phoneE164 != null && String(o.phoneE164).trim() !== ''),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^\+[1-9]\d{6,14}$/, { message: 'phoneE164 must be in E.164 format starting with +' }),
    __metadata("design:type", Object)
], UpdateProfileContactDto.prototype, "phoneE164", void 0);
//# sourceMappingURL=update-profile-contact.dto.js.map