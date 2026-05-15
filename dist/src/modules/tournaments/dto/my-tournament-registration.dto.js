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
exports.MyTournamentRegistrationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const tournament_summary_dto_1 = require("./tournament-summary.dto");
class MyTournamentRegistrationDto {
    id;
    tournamentId;
    teamName;
    createdAt;
    tournament;
}
exports.MyTournamentRegistrationDto = MyTournamentRegistrationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MyTournamentRegistrationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MyTournamentRegistrationDto.prototype, "tournamentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], MyTournamentRegistrationDto.prototype, "teamName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MyTournamentRegistrationDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: tournament_summary_dto_1.TournamentSummaryDto }),
    __metadata("design:type", tournament_summary_dto_1.TournamentSummaryDto)
], MyTournamentRegistrationDto.prototype, "tournament", void 0);
//# sourceMappingURL=my-tournament-registration.dto.js.map