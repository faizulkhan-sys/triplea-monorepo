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
exports.UpdateUserTypePermissions = void 0;
const customOptional_1 = require("../common/customs/customOptional");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateUserTypePermissions {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Permissions of the user type',
        example: '["gafsfa","asasasas","ahskjahs"]',
    }),
    class_validator_1.IsNotEmpty({ message: 'Permission are missing' }),
    class_validator_1.ArrayMinSize(1, { message: 'Role requires atleast one permission' }),
    class_validator_1.IsUUID('all', { each: true, message: 'Permissions must be a uuid array' }),
    __metadata("design:type", Array)
], UpdateUserTypePermissions.prototype, "permission", void 0);
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
], UpdateUserTypePermissions.prototype, "description", void 0);
exports.UpdateUserTypePermissions = UpdateUserTypePermissions;
//# sourceMappingURL=UpdateUserTypePermission.dto.js.map