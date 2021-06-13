import { MigrationInterface, QueryRunner } from 'typeorm';

export class employerSettings1609318366772 implements MigrationInterface {
  name = 'employerSettings1609318366772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SaEmployerPolicy" ADD "is_employer_paid" bit NOT NULL CONSTRAINT "DF_2048c0dbf3c40baef5d05a8aead" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "SaEmployerPolicy" ADD "has_advance_activated" bit NOT NULL CONSTRAINT "DF_19e3ab8e3cfa8ec9d7434f70b7a" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "SaEmployerPolicy" ADD "max_percent_of_salary" float`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SaEmployerPolicy" DROP COLUMN "max_percent_of_salary"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SaEmployerPolicy" DROP CONSTRAINT "DF_19e3ab8e3cfa8ec9d7434f70b7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SaEmployerPolicy" DROP COLUMN "has_advance_activated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SaEmployerPolicy" DROP CONSTRAINT "DF_2048c0dbf3c40baef5d05a8aead"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SaEmployerPolicy" DROP COLUMN "is_employer_paid"`,
    );
  }
}
