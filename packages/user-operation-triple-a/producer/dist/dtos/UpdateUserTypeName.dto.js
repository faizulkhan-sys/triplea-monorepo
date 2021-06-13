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
exports.UpdateUserTypeName = void 0;
const customOptional_1 = require("../common/customs/customOptional");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateUserTypeName {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Name of the user type',
        example: 'Business User',
    }),
    class_validator_1.IsNotEmpty({ message: 'User type name is required' }),
    class_validator_1.Matches(/^[-_ a-zA-Z0-9]+$/, { message: 'Role name must be alphanumeric' }),
    class_validator_1.Length(3, 50, {
        message: 'user type name must be between 3 and 50 characters long',
    }),
    __metadata("design:type", String)
], UpdateUserTypeName.prototype, "user_type", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Description of the user type',
        example: 'Business User',
    }),
    customOptional_1.IsOptional(),
    class_validator_1.Length(3, 90, {
        message: 'Description must be between 3 and 90 characters long',
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateUserTypeName.prototype, "description", void 0);
exports.UpdateUserTypeName = UpdateUserTypeName;
//# sourceMappingURL=UpdateUserTypeName.dto.js.map