import { MigrationInterface, QueryRunner } from "typeorm";

export class default1661804061203 implements MigrationInterface {
    name = 'default1661804061203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" ALTER COLUMN "minuteToResetAgain" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetpasswords" ALTER COLUMN "minuteToResetAgain" SET NOT NULL`);
    }

}
