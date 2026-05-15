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
exports.NationalLeaderboardQueryDto = exports.CityLeaderboardQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const game_mode_enum_1 = require("../../../common/enums/game-mode.enum");
class CityLeaderboardQueryDto {
    city;
    mode;
}
exports.CityLeaderboardQueryDto = CityLeaderboardQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bengaluru' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CityLeaderboardQueryDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    (0, class_validator_1.IsEnum)(game_mode_enum_1.GameMode),
    __metadata("design:type", String)
], CityLeaderboardQueryDto.prototype, "mode", void 0);
class NationalLeaderboardQueryDto {
    mode;
}
exports.NationalLeaderboardQueryDto = NationalLeaderboardQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: game_mode_enum_1.GameMode }),
    (0, class_validator_1.IsEnum)(game_mode_enum_1.GameMode),
    __metadata("design:type", String)
], NationalLeaderboardQueryDto.prototype, "mode", void 0);
//# sourceMappingURL=leaderboard-query.dto.js.map