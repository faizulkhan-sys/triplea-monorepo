import { MigrationInterface, QueryRunner } from 'typeorm';

export class calendar1616060057254 implements MigrationInterface {
  name = 'calendar1616060057254';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaCalendar" ("idx" uniqueidentifier NOT NULL CONSTRAINT "DF_c9142e519bc1b161bb1547aa329" DEFAULT NEWSEQUENTIALID(), "pay_type" varchar(150), "cut_off_days" int, "pre_deduction_report_days" int, "pre_deduction_report_time" varchar(150), "final_deduction_report_time" varchar(150), "created_on" datetime NOT NULL CONSTRAINT "DF_8a03d6aa06f74507300ebac23d2" DEFAULT getdate(), "is_active" bit NOT NULL CONSTRAINT "DF_9aec6caa6413c4ff82a70e9c0a5" DEFAULT (0), "is_obsolete" bit NOT NULL CONSTRAINT "DF_581c3527a593372220b69428be6" DEFAULT (0), "modified_on" datetime CONSTRAINT "DF_6039a3e85d7999ecf7a2b3524ab" DEFAULT getdate(), CONSTRAINT "PK_c9142e519bc1b161bb1547aa329" PRIMARY KEY ("idx"))`,
    );
    await queryRunner.query(
      `INSERT INTO "dbo"."SaCalendar" (pay_type,cut_off_days,pre_deduction_report_days,pre_deduction_report_time,final_deduction_report_time) VALUES('Salary',2,2,'11:00 PM','4:00 PM')`,
    );
    await queryRunner.query(
      `INSERT INTO "dbo"."SaCalendar" (pay_type,cut_off_days,pre_deduction_report_days,pre_deduction_report_time,final_deduction_report_time) VALUES('Hourly',2,0,'11:00 PM','4:00 PM')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dbo"."SaCalendar"`);
  }
}
