import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettingsSelectColumn1605132328043
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "settings" ADD "defaultToAllSelected" boolean DEFAULT false;'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "settings" DROP COLUMN "defaultToAllSelected";'
    );
  }
}
