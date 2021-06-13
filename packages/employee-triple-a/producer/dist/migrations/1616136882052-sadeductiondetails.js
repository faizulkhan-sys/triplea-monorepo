"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sadeductiondetails1616136882093 = void 0;
class sadeductiondetails1616136882093 {
    constructor() {
        this.name = 'sadeductiondetails1616136882093';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "SaEmployeeSetting" ADD is_employer_paid BIT DEFAULT 0 NOT NULL;`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "SaEmployeeSetting" Drop column is_employer_paid`);
    }
}
exports.sadeductiondetails1616136882093 = sadeductiondetails1616136882093;
//# sourceMappingURL=1616136882052-sadeductiondetails.js.map