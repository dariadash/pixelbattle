import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateFieldTableAgain1695252941087 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'fields',
            columns: [
                {
                    name: 'fieldId',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'row',
                    type: 'int',
                },
                {
                    name: 'col',
                    type: 'int',
                },
                {
                    name: 'color',
                    type: 'varchar',
                },
                {
                    name: 'createdDate',
                    type: 'timestamp',
                }
            ]
        }), true);
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_UNIQUE_COL_ROW" ON "fields" ("col", "row")');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "IDX_UNIQUE_COL_ROW"');
        await queryRunner.dropTable('fields');
    }

}
