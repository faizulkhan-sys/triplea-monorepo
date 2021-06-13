"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addisemployerpaid1616136882052 = void 0;
class addisemployerpaid1616136882052 {
    constructor() {
        this.name = 'addisemployerpaid1616136882052';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "dbo"."SaDeductionDetails" ("idx" uniqueidentifier NOT NULL CONSTRAINT "DF_04c36b93270432ee95a0dbe1605" DEFAULT NEWSEQUENTIALID(), "payroll_name" varchar(150), "company_name" varchar(150), "company_idx" varchar(150), "employee_type" varchar(150), "employee_name" varchar(150), "employee_idx" varchar(150), "state" varchar(150), "status" int, "payroll_start_date" date, "payroll_end_date" date, "final_deduction_run_date" date, "pre_deduction_run_date" date, "payroll_date" date, "next_deduction_run_time" varchar(255), "payroll_run_date" date, "next_payroll_run_date" date, "next_payroll_date" date, "next_deduction_run_date" date, "final_deduction_run_time" varchar(255), "pre_deduction_run_time" varchar(255), "cut_off_days" int, "employer_display_id" varchar(150), "employee_worker_id" varchar(150), "debit_pull" bit NOT NULL, "advance_owed" decimal NOT NULL, "fee_extended" decimal NOT NULL, "amount_extended" decimal NOT NULL, "fee_owed" decimal NOT NULL, "created_on" datetime NOT NULL CONSTRAINT "DF_98484fced14eaea45b20fb4a0e3" DEFAULT getdate(), "is_active" bit NOT NULL CONSTRAINT "DF_ef230b05615eb301796303c1b6d" DEFAULT (0), "is_obsolete" bit NOT NULL CONSTRAINT "DF_14a039047643e45f3987ccbeace" DEFAULT (0), "modified_on" datetime CONSTRAINT "DF_546cdde9af3739221d413ecdb6b" DEFAULT getdate(), CONSTRAINT "PK_04c36b93270432ee95a0dbe1605" PRIMARY KEY ("idx"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "dbo"."SaDeductionDetails"`);
    }
}
exports.addisemployerpaid1616136882052 = addisemployerpaid1616136882052;
//# sourceMappingURL=1616136882052-addisemployerpaid.js.map