import { MigrationInterface, QueryRunner } from 'typeorm';

export class addemployeeextradetailsfield1609924772964
  implements MigrationInterface {
  name = 'addemployeeextradetailsfield1609924772964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SaExcelHistory" ADD employee_details ntext`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SaExcelHistory" DROP employee_details`,
    );
  }
}
