import { MigrationInterface, QueryRunner } from "typeorm";

export class default1662219507536 implements MigrationInterface {
    name = 'default1662219507536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" RENAME COLUMN "createdDate" TO "created_date"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "lastDateReset"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "oldPassword"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "minuteToResetAgain"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "old_password" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "last_date_reset" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "minute_to_reset_again" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "minute_to_reset_again"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "last_date_reset"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "old_password"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "minuteToResetAgain" numeric`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "oldPassword" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "lastDateReset" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" RENAME COLUMN "created_date" TO "createdDate"`);
    }

}
