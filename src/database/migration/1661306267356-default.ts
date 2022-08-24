import { MigrationInterface, QueryRunner } from "typeorm";

export class default1661306267356 implements MigrationInterface {
    name = 'default1661306267356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD "type" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "type"`);
    }

}
