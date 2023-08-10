import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>
  ) {}

  async create(dto: CreateCategoryDto) {
    const newCategory = this.categoriesRepository.create(dto)
    return await this.categoriesRepository.save(newCategory)
  }

  async findAll() {
    return await this.categoriesRepository.find()
  }

  async findOne(criteria: object) {
    return await this.categoriesRepository.findOneBy(criteria)
  }
}
