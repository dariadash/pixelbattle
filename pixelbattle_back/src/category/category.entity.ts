import { Post } from "src/post/post.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    categoryId: number

    @Column()
    name: string

    @ManyToMany(() => Post, (post) => post.categories)
    posts?: Post[]
}