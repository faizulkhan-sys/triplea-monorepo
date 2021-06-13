import { MigrationInterface, QueryRunner } from 'typeorm';

export class addexcelFile1610617902198 implements MigrationInterface {
  name = 'addexcelFile1610617902198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaDeductionFiles" ("idx" uniqueidentifier NOT NULL CONSTRAINT "DF_c0c0c514d69d3dc83e5ff8b2ef5" DEFAULT NEWSEQUENTIALID(), "file_name" varchar(150), "employer_id" varchar(150), "created_on" datetime NOT NULL CONSTRAINT "DF_d7672a9b0ed2180db2e8a921e2b" DEFAULT getdate(), "is_active" bit NOT NULL CONSTRAINT "DF_41332d17ed6bccf6d075abe4954" DEFAULT (0), "is_obsolete" bit NOT NULL CONSTRAINT "DF_b128dbcebbf5a97610ebdd41be6" DEFAULT (0), "modified_on" datetime CONSTRAINT "DF_ed88b7874ab0daa3e6f8c1ce2e7" DEFAULT getdate(), CONSTRAINT "PK_c0c0c514d69d3dc83e5ff8b2ef5" PRIMARY KEY ("idx"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dbo"."SaDeductionFiles"`);
  }
}
