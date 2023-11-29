import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUniqueConstraintToFieldEntity1695240284216 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_UNIQUE_COL_ROW" ON "fields" ("col", "row")');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "IDX_UNIQUE_COL_ROW"');
    }

}
