import { Controller, Body, Get, Post } from "@nestjs/common";
import { Post as PostEntry } from "./post.entity";
import { PostService } from "./post.service";

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    async saveField(@Body() post: PostEntry) {
        await this.postService.createPost(post)
        return "Post created"
    }

    @Post('post_category')
    createPostCategory(@Body() createPostCategory: { postId: number, categoryId: number }) {
        this.postService.createPostCategory(createPostCategory)
        return "Post category created"
    }

    @Get()
    getAllPosts() {
        return this.postService.getAllPosts();
    }
}