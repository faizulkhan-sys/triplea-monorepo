"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const tokens_service_1 = require("./tokens.service");
const typeorm_1 = require("@nestjs/typeorm");
const RefreshToken_entity_1 = require("../../entities/RefreshToken.entity");
const Customer_entity_1 = require("../../entities/Customer.entity");
const Users_1 = require("../../entities/Users");
const index_1 = require("../../config/index");
const refresh_tokens_repository_1 = require("./refresh-tokens.repository");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let TokenModule = class TokenModule {
};
TokenModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([RefreshToken_entity_1.RefreshTokens, Customer_entity_1.Customer, Users_1.Users]),
            jwt_1.JwtModule.register({
                secret: index_1.default.jwt.secret,
                signOptions: {
                    expiresIn: index_1.default.jwt.access_expiry,
                },
            }),
        ],
        controllers: [],
        providers: [tokens_service_1.TokensService, refresh_tokens_repository_1.RefreshTokensRepository, jwt_strategy_1.JwtStrategy],
        exports: [tokens_service_1.TokensService],
    })
], TokenModule);
exports.TokenModule = TokenModule;
//# sourceMappingURL=token.module.js.map