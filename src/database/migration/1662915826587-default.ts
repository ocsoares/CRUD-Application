import { MigrationInterface, QueryRunner } from "typeorm";

export class default1662915826587 implements MigrationInterface {
    name = 'default1662915826587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logsadmin" ALTER COLUMN "id_real_account" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logsadmin" ALTER COLUMN "id_real_account" SET NOT NULL`);
    }

}
