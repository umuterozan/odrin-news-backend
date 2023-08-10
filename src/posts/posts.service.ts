import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    private categoriesService: CategoriesService,
    private usersService: UsersService
  ) {}

  async findOne(criteria: object) {
    return await this.postsRepository.findOneBy(criteria)
  }

  async create(dto: CreatePostDto, userId: number) {
    const slug = this.generateSlug(dto.title)
    const category = await this.categoriesService.findOne({ id: dto.categoryId })
    const user = await this.usersService.findOne({ id: userId })
    const newPost = this.postsRepository.create({
      thumbnail: dto.thumbnail,
      title: dto.title,
      body: dto.body,
      slug,
      category,
      user,
    })
    
    return await this.postsRepository.save(newPost)
  }

  generateSlug(title: string) {
    const transliterated = title
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+/g, "")
    .replace(/-+$/g, "");

    const randomNum = Math.floor(Math.random() * 1000000); // 0 ile 999999 arasında
    const slug = `${transliterated}-${randomNum}`;

    return slug;
  }
}
