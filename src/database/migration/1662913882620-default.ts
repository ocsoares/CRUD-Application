import { MigrationInterface, QueryRunner } from "typeorm";

export class default1662913882620 implements MigrationInterface {
    name = 'default1662913882620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logsadmin" ADD "id_real_account" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logsadmin" DROP COLUMN "id_real_account"`);
    }

}
