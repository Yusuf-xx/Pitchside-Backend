"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRecordsModule = void 0;
const common_1 = require("@nestjs/common");
const game_records_controller_1 = require("./game-records.controller");
const game_records_service_1 = require("./game-records.service");
let GameRecordsModule = class GameRecordsModule {
};
exports.GameRecordsModule = GameRecordsModule;
exports.GameRecordsModule = GameRecordsModule = __decorate([
    (0, common_1.Module)({
        controllers: [game_records_controller_1.GameRecordsController],
        providers: [game_records_service_1.GameRecordsService],
    })
], GameRecordsModule);
//# sourceMappingURL=game-records.module.js.map