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
exports.SetPassword = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const Base_dto_1 = require("./Base.dto");
class SetPassword extends swagger_1.PickType(Base_dto_1.BaseDto, ['password']) {
}
__decorate([
    swagger_1.ApiProperty({
        description: ' Token from email',
        example: 'test@1234',
    }),
    class_validator_1.IsNotEmpty({ message: 'Token cannot be empty' }),
    __metadata("design:type", String)
], SetPassword.prototype, "token", void 0);
exports.SetPassword = SetPassword;
//# sourceMappingURL=SetPassword.dto.js.map