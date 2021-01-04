import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1609789198949 implements MigrationInterface {
  name = "Initial1609789198949";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "app" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "path" varchar NOT NULL, "hash" varchar NOT NULL, "updatedAt" datetime NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "sentence" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL, "submitted" boolean NOT NULL, "viewed" boolean NOT NULL, "content" varchar NOT NULL)`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d642b55814d0dcc3eccffa1f87" ON "sentence" ("content") `
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "includeUUID" boolean NOT NULL, "uuid" varchar NOT NULL, "defaultToAllSelected" boolean NOT NULL, "sentencesPerPage" integer NOT NULL)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP INDEX "IDX_d642b55814d0dcc3eccffa1f87"`);
    await queryRunner.query(`DROP TABLE "sentence"`);
    await queryRunner.query(`DROP TABLE "app"`);
  }
}
