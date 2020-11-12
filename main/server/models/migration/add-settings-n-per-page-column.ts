import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettingsNPerPageColumn1605135125698
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "settings" ADD "sentencesPerPage" int DEFAULT 5;'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "settings" DROP COLUMN "sentencesPerPage";'
    );
  }
}
