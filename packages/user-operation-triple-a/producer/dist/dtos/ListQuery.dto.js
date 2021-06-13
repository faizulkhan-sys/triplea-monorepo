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
exports.ListPendingDto = exports.ListActiveUserTypeDto = exports.ListActiveUserDto = exports.ListQueryBaseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ListQueryBaseDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.search = '';
        this.status = '';
        this.request_type = '';
    }
}
__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Transform(({ value }) => Number(value), { toClassOnly: true }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Object)
], ListQueryBaseDto.prototype, "page", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_transformer_1.Transform(({ value }) => Number(value), { toClassOnly: true }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Object)
], ListQueryBaseDto.prototype, "limit", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], ListQueryBaseDto.prototype, "search", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], ListQueryBaseDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], ListQueryBaseDto.prototype, "request_type", void 0);
exports.ListQueryBaseDto = ListQueryBaseDto;
class ListActiveUserDto extends swagger_1.PickType(ListQueryBaseDto, [
    'page',
    'limit',
    'search',
    'status',
]) {
    constructor() {
        super(...arguments);
        this.user_type = '';
    }
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], ListActiveUserDto.prototype, "user_type", void 0);
exports.ListActiveUserDto = ListActiveUserDto;
class ListActiveUserTypeDto extends swagger_1.PickType(ListQueryBaseDto, [
    'page',
    'limit',
    'search',
]) {
}
exports.ListActiveUserTypeDto = ListActiveUserTypeDto;
class ListPendingDto extends swagger_1.PickType(ListQueryBaseDto, [
    'page',
    'limit',
    'search',
    'request_type',
]) {
}
exports.ListPendingDto = ListPendingDto;
//# sourceMappingURL=ListQuery.dto.js.map