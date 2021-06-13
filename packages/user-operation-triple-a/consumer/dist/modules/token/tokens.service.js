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
exports.TokensService = void 0;
const Customer_entity_1 = require("../../entities/Customer.entity");
const RefreshToken_entity_1 = require("../../entities/RefreshToken.entity");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_2 = require("typeorm");
const refresh_tokens_repository_1 = require("./refresh-tokens.repository");
const response_interface_1 = require("../../common/interfaces/response.interface");
const js_utils_1 = require("@rubiin/js-utils");
const BASE_OPTIONS = {
    issuer: 'orbis',
    audience: 'orbis',
};
let TokensService = class TokensService {
    constructor(tokens, jwt, customerRepository) {
        this.customerRepository = customerRepository;
        this.tokens = tokens;
        this.jwt = jwt;
    }
    async generateAccessToken(user) {
        const opts = Object.assign(Object.assign({}, BASE_OPTIONS), { subject: String(user.id) });
        return this.jwt.signAsync(Object.assign({}, this.pickCustomerFields(user)), opts);
    }
    async generateRefreshToken(user, expiresIn) {
        const token = await this.tokens.createRefreshToken(user, expiresIn);
        const opts = Object.assign(Object.assign({}, BASE_OPTIONS), { expiresIn, subject: String(user.id), jwtid: String(token.id) });
        return this.jwt.signAsync({}, opts);
    }
    async resolveRefreshToken(encoded) {
        const payload = await this.decodeRefreshToken(encoded);
        const token = await this.getStoredTokenFromRefreshTokenPayload(payload);
        if (!token) {
            throw new common_1.UnprocessableEntityException('Refresh token not found');
        }
        if (token.is_revoked) {
            throw new common_1.UnprocessableEntityException('Refresh token revoked');
        }
        const user = await this.getUserFromRefreshTokenPayload(payload);
        if (!user) {
            throw new common_1.UnprocessableEntityException('Refresh token malformed');
        }
        return { user, token };
    }
    async createAccessTokenFromRefreshToken(refresh) {
        const { user } = await this.resolveRefreshToken(refresh);
        const token = await this.generateAccessToken(user);
        return { user, token };
    }
    async decodeRefreshToken(token) {
        try {
            return this.jwt.verifyAsync(token);
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new common_1.UnprocessableEntityException('Refresh token expired');
            }
            else {
                throw new common_1.UnprocessableEntityException('Refresh token malformed');
            }
        }
    }
    async getUserFromRefreshTokenPayload(payload) {
        const subId = payload.sub;
        if (!subId) {
            throw new common_1.UnprocessableEntityException('Refresh token malformed');
        }
        return this.customerRepository.findOne({
            where: {
                id: subId,
            },
        });
    }
    async getStoredTokenFromRefreshTokenPayload(payload) {
        const tokenId = payload.jti;
        if (!tokenId) {
            throw new common_1.UnprocessableEntityException('Refresh token malformed');
        }
        return this.tokens.findTokenById(tokenId);
    }
    async deleteRefreshTokenForUser(user) {
        await this.tokens.deleteTokensForUser(user);
        return { message: 'Operation Sucessful', statusCode: 200 };
    }
    async deleteRefreshToken(user, payload) {
        const tokenId = payload.jti;
        if (!tokenId) {
            throw new common_1.UnprocessableEntityException('Refresh token malformed');
        }
        await this.tokens.deleteToken(user, tokenId);
        return { message: 'Operation Sucessful', statusCode: 200 };
    }
    pickCustomerFields(user) {
        return js_utils_1.pick(user, ['id', 'idx', 'employer_id', 'employee_id']);
    }
};
TokensService = __decorate([
    common_1.Injectable(),
    __param(2, typeorm_1.InjectRepository(Customer_entity_1.Customer)),
    __metadata("design:paramtypes", [refresh_tokens_repository_1.RefreshTokensRepository,
        jwt_1.JwtService,
        typeorm_2.Repository])
], TokensService);
exports.TokensService = TokensService;
//# sourceMappingURL=tokens.service.js.map