import { MigrationInterface, QueryRunner } from "typeorm";

export class default1662913971448 implements MigrationInterface {
    name = 'default1662913971448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logsadmin" DROP COLUMN "id_real_account"`);
        await queryRunner.query(`ALTER TABLE "logsadmin" ADD "id_real_account" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logsadmin" DROP COLUMN "id_real_account"`);
        await queryRunner.query(`ALTER TABLE "logsadmin" ADD "id_real_account" text NOT NULL`);
    }

}
