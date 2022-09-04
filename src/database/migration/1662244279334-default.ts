import { MigrationInterface, QueryRunner } from "typeorm";

export class default1662244279334 implements MigrationInterface {
    name = 'default1662244279334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "savecommentsadmin" ("id" SERIAL NOT NULL, "username" text NOT NULL, "comment" text NOT NULL, "date" text NOT NULL, CONSTRAINT "PK_78ddddd5c17136f4a337349d9a8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "savecommentsadmin"`);
    }

}
