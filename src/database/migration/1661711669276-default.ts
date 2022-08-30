import { MigrationInterface, QueryRunner } from "typeorm";

export class default1661711669276 implements MigrationInterface {
    name = 'default1661711669276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "resetpasswords" ("id" SERIAL NOT NULL, "oldPassword" text NOT NULL, "resetOnDate" text NOT NULL, "minuteToResetAgain" integer NOT NULL, CONSTRAINT "PK_743bad158dde6044f01564354c5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "resetpasswords"`);
    }

}
