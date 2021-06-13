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
exports.PaginationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PaginationDto {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Page'
    }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Offset'
    }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "offset", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Limit'
    }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Request Type'
    }),
    __metadata("design:type", String)
], PaginationDto.prototype, "request_type", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Order By'
    }),
    __metadata("design:type", String)
], PaginationDto.prototype, "order_by", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Search'
    }),
    __metadata("design:type", Object)
], PaginationDto.prototype, "search", void 0);
exports.PaginationDto = PaginationDto;
//# sourceMappingURL=Pagination.dto.js.map