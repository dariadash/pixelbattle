import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Category } from "./category.entity"

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    saveCategory(category: Category) {
        return this.categoryRepository.save(category);
    }

    getAllCategories(): Promise<Category[]> {
        return this.categoryRepository
            .createQueryBuilder("category")
            .leftJoinAndSelect("category.posts", "category")
            .getMany()
    }
}