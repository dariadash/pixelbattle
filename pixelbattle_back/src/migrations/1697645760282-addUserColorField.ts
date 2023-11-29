import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUserColorField1697645760282 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" ADD "usernameColor" character varying NOT NULL DEFAULT '#111111'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "usernameColor"
        `);
    }

}
