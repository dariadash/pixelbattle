import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class DeleteUserFieldId1695157817261 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('fields', 'fields_userId_users_id');
        await queryRunner.dropColumn('fields', 'userId');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey('fields', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['userId'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            name: 'fields_userId_users_id'
        }));
        await queryRunner.addColumn('fields', new TableColumn({ name: 'userId', type: 'integer' }));
    }

}
