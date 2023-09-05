import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AccessTokenGuard, AdminGuard } from 'src/common/guards';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}
  
  @UseGuards(AdminGuard)
  @UseGuards(AccessTokenGuard)
  @Post('create')
  async createCategory(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);
    if (category) return {
      message: 'successful',
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getCategories(@Query('limit') limit: number = 0, @Query('order') order: 'ASC' | 'DESC' = 'ASC') {
    return await this.categoriesService.find(limit, order);
  }
}
