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
exports.ChangeUserPass = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const Base_dto_1 = require("./Base.dto");
class ChangeUserPass extends swagger_1.PickType(Base_dto_1.BaseDto, ['password']) {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Current password',
        example: 'test@1234',
    }),
    class_validator_1.IsNotEmpty({ message: 'Current password cannot be empty' }),
    class_validator_1.Length(8, 64, {
        message: 'Password must be between 6 to 64 characters long',
    }),
    class_validator_1.Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least 1 special character,uppercase letter, lowercase letter and number each',
    }),
    __metadata("design:type", String)
], ChangeUserPass.prototype, "current_password", void 0);
exports.ChangeUserPass = ChangeUserPass;
//# sourceMappingURL=ChangeUserPass.dto.js.map