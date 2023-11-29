import { Post } from "src/post/post.entity";
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "../category/category.entity";

@Entity('post_category')
export class PostCategory {
    @PrimaryColumn({ name: 'post_id' })
    postId: number;

    @PrimaryColumn({ name: 'category_id' })
    categoryId: number;

    @ManyToOne(() => Post, post => post.categories)
    @JoinColumn([{ name: 'post_id', referencedColumnName: 'postId' }])
    posts: Post[];

    @ManyToOne(() => Category, category => category.posts)
    @JoinColumn([{ name: 'category_id', referencedColumnName: 'categoryId' }])
    categories: Category[];
}