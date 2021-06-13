import { MigrationInterface, QueryRunner } from 'typeorm';

export class sadeductiondetails1616136882093 implements MigrationInterface {
  name = 'sadeductiondetails1616136882093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SaEmployeeSetting" ADD is_employer_paid BIT DEFAULT 0 NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SaEmployeeSetting" Drop column is_employer_paid`,
    );
  }
}
