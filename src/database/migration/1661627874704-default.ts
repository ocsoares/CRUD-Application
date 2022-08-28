import { MigrationInterface, QueryRunner } from "typeorm";

export class default1661627874704 implements MigrationInterface {
    name = 'default1661627874704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD "createdDate" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "createdDate"`);
    }

}
