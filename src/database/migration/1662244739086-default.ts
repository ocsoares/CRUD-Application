import { MigrationInterface, QueryRunner } from "typeorm";

export class default1662244739086 implements MigrationInterface {
    name = 'default1662244739086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "savecommentsadmin" ADD "email" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "savecommentsadmin" DROP COLUMN "email"`);
    }

}
