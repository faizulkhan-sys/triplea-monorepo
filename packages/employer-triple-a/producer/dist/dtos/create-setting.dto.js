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
exports.AddUpdatesettings = void 0;
const customOptional_1 = require("../common/customOptional");
const class_validator_1 = require("class-validator");
class AddUpdatesettings {
}
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.IsBoolean({ message: 'Auto approve must be boolean' }),
    __metadata("design:type", Boolean)
], AddUpdatesettings.prototype, "auto_approve", void 0);
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.IsBoolean({ message: 'Auto invite must be boolean' }),
    __metadata("design:type", Boolean)
], AddUpdatesettings.prototype, "auto_invite", void 0);
exports.AddUpdatesettings = AddUpdatesettings;
//# sourceMappingURL=create-setting.dto.js.map