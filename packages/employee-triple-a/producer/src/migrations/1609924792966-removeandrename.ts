import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeandrename1609924792966 implements MigrationInterface {
  name = 'removeandrename1609924792966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `EXEC sp_rename 'dbo.SaExcelHistory', 'SaDeductionHistory'`,
    );
    await queryRunner.query(`DROP TABLE SaDeductionReport`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "SaExcelHistory" DROP excel_data`);
  }
}
