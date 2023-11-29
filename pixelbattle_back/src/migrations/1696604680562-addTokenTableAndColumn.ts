import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm"

export class AddTokenTableAndColumn1696604680562 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'token',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'refreshToken',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'userId',
                    type: 'int',
                    isNullable: true,
                }
            ]
        }), true);
        await queryRunner.addColumns('users', ([
            new TableColumn({
                name: 'isActivated',
                type: 'boolean',
                default: false,
            }),
            new TableColumn({
                name: 'activationLink',
                type: 'varchar',
                isNullable: true
            })
        ]))

        await queryRunner.query(`
            ALTER TABLE "token"
            ADD CONSTRAINT "FK_token_userId"
            FOREIGN KEY ("userId")
            REFERENCES "users"("userId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "token"
            DROP CONSTRAINT "FK_token_userId"
        `);
        await queryRunner.dropColumns('users', ['isActivated', 'activationLink']);
        await queryRunner.dropTable('token');
    }

}
