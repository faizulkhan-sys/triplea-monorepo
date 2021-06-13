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
exports.CreateSaChargeDto = void 0;
const class_validator_1 = require("class-validator");
class CreateSaChargeDto {
}
__decorate([
    class_validator_1.IsNotEmpty({ message: 'Charge name should not empty' }),
    class_validator_1.Length(3, 30, {
        message: 'Charge name must be between 3 and 30 characters long',
    }),
    class_validator_1.Matches(/^[-_ a-zA-Z0-9]+$/, {
        message: 'Charge name must be alphanumeric',
    }),
    __metadata("design:type", String)
], CreateSaChargeDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'Charge value should not empty' }),
    class_validator_1.IsNumber({ allowInfinity: false, allowNaN: false }),
    __metadata("design:type", Number)
], CreateSaChargeDto.prototype, "charge_value", void 0);
__decorate([
    class_validator_1.IsIn(['PERCENT', 'FLAT'], {
        message: 'Value must be either Percent or Flat',
    }),
    __metadata("design:type", String)
], CreateSaChargeDto.prototype, "charge_type", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'Is default should not empty' }),
    class_validator_1.IsBoolean({ message: 'Is default should be boolean' }),
    __metadata("design:type", Boolean)
], CreateSaChargeDto.prototype, "is_default_charge", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.is_default_charge.toString() === 'false'),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateSaChargeDto.prototype, "expires_on", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.is_default_charge.toString() === 'false'),
    class_validator_1.IsUUID('all', { message: 'Default charge Idx must be an uuid' }),
    __metadata("design:type", String)
], CreateSaChargeDto.prototype, "default_charge_idx", void 0);
__decorate([
    class_validator_1.IsIn(['EMPLOYEE', 'EMPLOYER'], {
        message: 'Invalid charge payer',
    }),
    __metadata("design:type", String)
], CreateSaChargeDto.prototype, "charge_payer", void 0);
exports.CreateSaChargeDto = CreateSaChargeDto;
//# sourceMappingURL=CreateSaCharge.dto.js.map