import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm"

export class FieldMigration1692701755177 implements MigrationInterface {

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
                    name: 'col',
                    type: 'int',
                },
                {
                    name: 'row',
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

        await queryRunner.addColumn('fields', new TableColumn({ name: 'userId', type: 'integer' }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('fields', 'userId');
        await queryRunner.dropTable('fields');
    }

}
