import { MigrationInterface, QueryRunner } from "typeorm";

export class default1661802286103 implements MigrationInterface {
    name = 'default1661802286103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" RENAME COLUMN "oldpassword" TO "old_password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" RENAME COLUMN "old_password" TO "oldpassword"`);
    }

}
