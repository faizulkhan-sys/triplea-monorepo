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
exports.ProtocolUpdateDto = void 0;
const customOptional_1 = require("../common/customs/customOptional");
const class_validator_1 = require("class-validator");
class ProtocolUpdateDto {
}
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], ProtocolUpdateDto.prototype, "login_attempt_interval", void 0);
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.IsIn(['h', 'd', 'w', 'M', 'y'], {
        message: 'login_interval_unit be either h,d,w,M,y',
    }),
    __metadata("design:type", String)
], ProtocolUpdateDto.prototype, "login_interval_unit", void 0);
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], ProtocolUpdateDto.prototype, "login_max_retry", void 0);
exports.ProtocolUpdateDto = ProtocolUpdateDto;
//# sourceMappingURL=protocol.dto.js.map