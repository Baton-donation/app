import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1604872621134 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "includeUUID" boolean NOT NULL, "uuid" varchar NOT NULL)'
    );
    await queryRunner.query(
      'CREATE TABLE "sentence" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL, "submitted" boolean NOT NULL, "viewed" boolean NOT NULL, "content" varchar NOT NULL)'
    );
    await queryRunner.query(
      'CREATE TABLE "app" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar, "path" varchar, "hash" varchar, "updatedAt" datetime)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP table "settings";');
    await queryRunner.query('DROP table "sentence";');
    await queryRunner.query('DROP table "app";');
  }
}
