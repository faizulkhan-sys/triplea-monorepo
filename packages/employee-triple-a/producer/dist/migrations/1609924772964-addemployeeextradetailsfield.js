"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addemployeeextradetailsfield1609924772964 = void 0;
class addemployeeextradetailsfield1609924772964 {
    constructor() {
        this.name = 'addemployeeextradetailsfield1609924772964';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "SaExcelHistory" ADD employee_details ntext`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "SaExcelHistory" DROP employee_details`);
    }
}
exports.addemployeeextradetailsfield1609924772964 = addemployeeextradetailsfield1609924772964;
//# sourceMappingURL=1609924772964-addemployeeextradetailsfield.js.map