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
exports.WaitlistSignupDto = exports.WaitlistProgram = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var WaitlistProgram;
(function (WaitlistProgram) {
    WaitlistProgram["SCOUT_MODE"] = "SCOUT_MODE";
})(WaitlistProgram || (exports.WaitlistProgram = WaitlistProgram = {}));
class WaitlistSignupDto {
    program;
    email;
    city;
}
exports.WaitlistSignupDto = WaitlistSignupDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: WaitlistProgram }),
    (0, class_validator_1.IsEnum)(WaitlistProgram),
    __metadata("design:type", String)
], WaitlistSignupDto.prototype, "program", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], WaitlistSignupDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Delhi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], WaitlistSignupDto.prototype, "city", void 0);
//# sourceMappingURL=waitlist-signup.dto.js.map