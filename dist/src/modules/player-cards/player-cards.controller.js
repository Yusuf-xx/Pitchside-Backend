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
exports.PlayerCardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const game_mode_enum_1 = require("../../common/enums/game-mode.enum");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const player_card_dto_1 = require("./dto/player-card.dto");
const player_cards_service_1 = require("./player-cards.service");
let PlayerCardsController = class PlayerCardsController {
    playerCardsService;
    constructor(playerCardsService) {
        this.playerCardsService = playerCardsService;
    }
    getMine(user, mode) {
        return this.playerCardsService.getMine(user.userId, mode);
    }
    getByUser(userId, mode) {
        return this.playerCardsService.getPublic(userId, mode);
    }
};
exports.PlayerCardsController = PlayerCardsController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Current user card; ?mode= switches football / futsal / cricket view' }),
    (0, swagger_1.ApiQuery)({ name: 'mode', required: false, enum: game_mode_enum_1.GameMode }),
    (0, swagger_1.ApiOkResponse)({ type: player_card_dto_1.PlayerCardDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlayerCardsController.prototype, "getMine", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Public player card' }),
    (0, swagger_1.ApiQuery)({ name: 'mode', required: false, enum: game_mode_enum_1.GameMode }),
    (0, swagger_1.ApiOkResponse)({ type: player_card_dto_1.PlayerCardDto }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlayerCardsController.prototype, "getByUser", null);
exports.PlayerCardsController = PlayerCardsController = __decorate([
    (0, swagger_1.ApiTags)('Player Cards'),
    (0, common_1.Controller)('player-cards'),
    __metadata("design:paramtypes", [player_cards_service_1.PlayerCardsService])
], PlayerCardsController);
//# sourceMappingURL=player-cards.controller.js.map