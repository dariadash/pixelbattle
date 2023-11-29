import { Category } from "src/category/category.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    postId: number

    @Column()
    postTitle: string

    @Column()
    postText: string

    @ManyToMany(() => Category, (category) => category.posts)
    @JoinTable({
        name: 'post_category',
        joinColumn: {
            name: 'post_id',
            referencedColumnName: 'postId',
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'categoryId',
        },
    })
    categories?: Category[]
}
