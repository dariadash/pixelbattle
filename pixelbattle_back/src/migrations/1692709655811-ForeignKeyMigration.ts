import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class ForeignKeyMigration1692709655811 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey('fields', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['userId'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            name: 'fields_userId_users_id'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('fields', 'fields_userId_users_id');
    }

}
