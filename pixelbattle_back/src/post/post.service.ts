import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostCategory } from './post_category.entity';


@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(PostCategory)
        private postCategoryRepository: Repository<PostCategory>
    ) { }

    createPost(post: Post) {
        return this.postRepository.save(post)
    }

    createPostCategory(createPostCategory: { postId: number, categoryId: number }) {
        const post = this.postRepository.findOne({
            where: {
                postId: createPostCategory.postId
            }
        });

        if (!post) {
            throw new NotFoundException()
        }

        this.postCategoryRepository.save(createPostCategory)
    }

    getAllPosts(): Promise<Post[]> {
        return this.postRepository
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.categories", "post")
            .getMany()
    }
}
