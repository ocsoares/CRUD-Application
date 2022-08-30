import { MigrationInterface, QueryRunner } from "typeorm";

export class default1661802175720 implements MigrationInterface {
    name = 'default1661802175720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" RENAME COLUMN "oldPassword" TO "oldpassword"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" RENAME COLUMN "oldpassword" TO "oldPassword"`);
    }

}
