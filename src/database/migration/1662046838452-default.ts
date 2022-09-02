import { MigrationInterface, QueryRunner } from "typeorm";

export class default1662046838452 implements MigrationInterface {
    name = 'default1662046838452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" RENAME COLUMN "resetOnDate" TO "lastDateReset"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" RENAME COLUMN "lastDateReset" TO "resetOnDate"`);
    }

}
