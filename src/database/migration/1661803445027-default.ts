import { MigrationInterface, QueryRunner } from "typeorm";

export class default1661803445027 implements MigrationInterface {
    name = 'default1661803445027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "old_password"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "email" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "oldPassword" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "oldPassword"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "resetpasswords" ADD "old_password" text NOT NULL`);
    }

}
