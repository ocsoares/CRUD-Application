import { MigrationInterface, QueryRunner } from "typeorm";

export class default1662422996150 implements MigrationInterface {
    name = 'default1662422996150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "author" text NOT NULL, "title" text NOT NULL, "text" text NOT NULL, "published_in" text NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
