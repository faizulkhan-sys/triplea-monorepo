"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeandrename1609924792966 = void 0;
class removeandrename1609924792966 {
    constructor() {
        this.name = 'removeandrename1609924792966';
    }
    async up(queryRunner) {
        await queryRunner.query(`EXEC sp_rename 'dbo.SaExcelHistory', 'SaDeductionHistory'`);
        await queryRunner.query(`DROP TABLE SaDeductionReport`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "SaExcelHistory" DROP excel_data`);
    }
}
exports.removeandrename1609924792966 = removeandrename1609924792966;
//# sourceMappingURL=1609924792966-removeandrename.js.map