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
exports.CreateUserType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserType {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Name of User type',
        example: 'fab74e6089390695fe29f591068abcbf10f5cc25',
    }),
    class_validator_1.IsNotEmpty({ message: 'User type name is required' }),
    class_validator_1.Length(3, 90, {
        message: 'User type name must be between 3 and 90 characters long',
    }),
    class_validator_1.Matches(/^[-_ a-zA-Z0-9]+$/, {
        message: 'User type name must be alphanumeric',
    }),
    __metadata("design:type", String)
], CreateUserType.prototype, "user_type", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Permission array',
        example: [
            'fab74e6089390695fe29f591068abcbf10f5cc25',
            'hab74e6089390695fe29f591068abcbf10f5cc25',
        ],
    }),
    class_validator_1.IsNotEmpty({ message: 'Permission are missing' }),
    class_validator_1.IsUUID('all', { each: true, message: 'Permissions must be a uuid array' }),
    class_validator_1.ArrayMinSize(1, { message: 'User type requires at least one permission' }),
    __metadata("design:type", Array)
], CreateUserType.prototype, "permission", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Description of User type',
        example: 'This is a description',
    }),
    class_validator_1.IsNotEmpty({ message: 'Description is required' }),
    class_validator_1.Length(3, 90, {
        message: 'Description must be between 3 and 90 characters long',
    }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateUserType.prototype, "description", void 0);
exports.CreateUserType = CreateUserType;
//# sourceMappingURL=CreateUserType.dto.js.map