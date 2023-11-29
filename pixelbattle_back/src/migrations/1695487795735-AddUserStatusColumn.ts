import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUserStatusColumn1695487795735 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" ADD "status" character varying NOT NULL DEFAULT 'regular'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "status"
        `);
    }

}
