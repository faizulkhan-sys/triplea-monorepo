"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokensRepository = void 0;
const common_1 = require("@nestjs/common");
const RefreshToken_entity_1 = require("../../entities/RefreshToken.entity");
const Users_1 = require("../../entities/Users");
let RefreshTokensRepository = class RefreshTokensRepository {
    async createRefreshToken(user, ttl) {
        const token = new RefreshToken_entity_1.RefreshTokens();
        token.user = user;
        token.is_revoked = false;
        const expiration = new Date();
        expiration.setTime(expiration.getTime() + ttl * 1000);
        token.expires_in = expiration;
        return token.save();
    }
    async findTokenById(id) {
        return RefreshToken_entity_1.RefreshTokens.findOne({
            where: {
                id,
                is_revoked: false,
            },
        });
    }
    async deleteTokensForUser(employer) {
        return RefreshToken_entity_1.RefreshTokens.update({ user: employer }, { is_revoked: true });
    }
    async deleteToken(employee, tokenId) {
        return RefreshToken_entity_1.RefreshTokens.update({ user: employee, id: tokenId }, { is_revoked: true });
    }
};
RefreshTokensRepository = __decorate([
    common_1.Injectable()
], RefreshTokensRepository);
exports.RefreshTokensRepository = RefreshTokensRepository;
//# sourceMappingURL=refresh-tokens.repository.js.map