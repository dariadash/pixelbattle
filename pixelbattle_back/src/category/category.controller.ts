import { Controller, Post, Body, Get } from "@nestjs/common";
import { Category } from "./category.entity";
import { CategoryService } from "./category.service";

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    async saveField(@Body() category: Category) {
        await this.categoryService.saveCategory(category)
        return "Category created"
    }

    @Get()
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }
}