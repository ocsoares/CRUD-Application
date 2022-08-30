import { MigrationInterface, QueryRunner } from "typeorm";

export class default1661803850826 implements MigrationInterface {
    name = 'default1661803850826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "minuteToResetAgain"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "minuteToResetAgain" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "minuteToResetAgain"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "minuteToResetAgain" integer NOT NULL`);
    }

}
