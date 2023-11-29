import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostCategory } from './post_category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, Category, PostCategory])],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule { }
