import { MigrationInterface, QueryRunner } from "typeorm";

export class default1661711579272 implements MigrationInterface {
    name = 'default1661711579272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "resetPasswords" ("id" SERIAL NOT NULL, "oldPassword" text NOT NULL, "resetOnDate" text NOT NULL, "minuteToResetAgain" integer NOT NULL, CONSTRAINT "PK_198264191a56062994d9d089230" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "resetPasswords"`);
    }

}
