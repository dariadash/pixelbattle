import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class AddPostCategoryTables1693651781738 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'posts',
            columns: [{
                name: 'postId',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
                isNullable: false
            },
            {
                name: 'postTitle',
                type: 'varchar',
            },
            {
                name: 'postText',
                type: 'varchar',
            },
            ]
        }), true)

        await queryRunner.createTable(new Table({
            name: 'categories',
            columns: [{
                name: 'categoryId',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
                isNullable: false
            },
            {
                name: 'name',
                type: 'varchar',
            }]
        }), true)

        await queryRunner.createTable(new Table({
            name: 'post_category',
            columns: [
                {
                    name: 'post_id',
                    type: 'int',
                    isPrimary: true,
                    isNullable: false,
                    unsigned: false
                },
                {
                    name: 'category_id',
                    type: 'int',
                    isPrimary: true,
                    isNullable: false,
                    unsigned: false
                }
            ]
        }))

        await queryRunner.query('CREATE INDEX "IDX_xxxx_post_id" ON "post_category" ("post_id")');
        await queryRunner.query('CREATE INDEX "IDX_xxxx_category_id" ON "post_category" ("category_id")');
        await queryRunner.query('ALTER TABLE "post_category" ADD CONSTRAINT "FK_xxxx_category" FOREIGN KEY ("category_id") REFERENCES "categories" ("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "post_category" ADD CONSTRAINT "FK_xxxx_post" FOREIGN KEY ("post_id") REFERENCES "posts" ("postId") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "post_category" DROP FOREIGN KEY "FK_xxxx_post"');
        await queryRunner.query('ALTER TABLE "post_category" DROP FOREIGN KEY "FK_xxxx_category"');
        await queryRunner.query('DROP INDEX "IDX_xxxx_category_id" ON "post_category"');
        await queryRunner.query('DROP INDEX "IDX_xxxx_post_id" ON "post_category"');

        await queryRunner.dropTable('post_category');
        await queryRunner.query('DROP INDEX "IDX_xxxx_category_id" ON "categories"');
        await queryRunner.query('DROP INDEX "IDX_xxxx_post_id" ON "posts"');
        await queryRunner.dropTable('categories');
        await queryRunner.dropTable('posts');
    }

}
