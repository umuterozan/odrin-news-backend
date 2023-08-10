import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AccessTokenGuard } from 'src/common/guards';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async getCategories() {
    return await this.categoriesService.findAll();
  }
  
  @UseGuards(AccessTokenGuard)
  @Post('create')
  async createCategory(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);
    if (category) return {
      success: true,
    }
  }
}
