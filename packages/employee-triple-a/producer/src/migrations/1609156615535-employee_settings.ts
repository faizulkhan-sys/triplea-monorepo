import { MigrationInterface, QueryRunner } from 'typeorm';

export class employeeSettings1609156615535 implements MigrationInterface {
  name = 'employeeSettings1609156615535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaEmployeeSetting" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_d8b24e5c5247d3cac60c90931eb" DEFAULT NEWSEQUENTIALID(), "has_advance_activated" bit NOT NULL CONSTRAINT "DF_b43f77e0e4103516d42572147ff" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_cd22291456c435b3f124d534306" DEFAULT getdate(), "modified_on" datetime CONSTRAINT "DF_ea2dfcca995891d9e789435b4f2" DEFAULT getdate(), "expires_on" date, "is_obsolete" bit NOT NULL CONSTRAINT "DF_b43f77e0e4103516d44572147ff" DEFAULT 0, "max_percent_of_salary" float NOT NULL, "employee_id" int NOT NULL, CONSTRAINT "UQ_d8b24e5c5247d3cac60c90931eb" UNIQUE ("idx"), CONSTRAINT "PK_18c5495ea3ed6799f1056b48ac1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaEmployeeSetting" ADD CONSTRAINT "FK_5499d4167d50b0da8c38a321448" FOREIGN KEY ("employee_id") REFERENCES "dbo"."Customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaEmployeeSetting" DROP CONSTRAINT "FK_5499d4167d50b0da8c38a321448"`,
    );
    await queryRunner.query(`DROP TABLE "dbo"."SaEmployeeSetting"`);
  }
}
