import { MigrationInterface, QueryRunner } from "typeorm";

export class default1662254098378 implements MigrationInterface {
    name = 'default1662254098378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logsadmin" ("id" SERIAL NOT NULL, "username" text NOT NULL, "comment" text NOT NULL, "email" text NOT NULL, "date" text NOT NULL, CONSTRAINT "PK_061d6c8c5a47cf9ce5346c2be26" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "logsadmin"`);
    }

}
