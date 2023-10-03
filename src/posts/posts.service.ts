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

  async findOne(criteria: Object) {
    return await this.postsRepository.findOneBy(criteria)
  }

  async findOneBySlug(slug: string) {
    return await this.postsRepository.createQueryBuilder('posts')
    .leftJoinAndSelect('posts.category', 'category')
    .leftJoinAndSelect('posts.user', 'user')
    .leftJoinAndSelect('posts.comments', 'comments')
    .select(['posts.id', 'posts.thumbnail', 'posts.title', 'posts.body', 'posts.slug', 'posts.createdAt', 'category.name', 'user.username'])
    .where("posts.slug = :slug", {slug})
    .addSelect((subQuery) => {
      return subQuery
        .select('COUNT(comments.id)', 'commentsCount')
        .from('comments', 'comments')
        .where('comments.post.id = posts.id')
    }, 'count')
    .loadRelationCountAndMap('posts.commentsCount', 'posts.comments')
    .getOne()
  }

  async find(limit: number, sort: string, order: 'ASC' | 'DESC') {
    return await this.postsRepository.createQueryBuilder('posts')
    .leftJoinAndSelect('posts.category', 'category')
    .leftJoinAndSelect('posts.user', 'user')
    .leftJoinAndSelect('posts.comments', 'comments')
    .select(['posts.id', 'posts.thumbnail', 'posts.title', 'posts.body', 'posts.slug', 'posts.createdAt', 'category.name', 'user.username'])
    .addSelect((subQuery) => {
      return subQuery
        .select('COUNT(comments.id)', 'commentsCount')
        .from('comments', 'comments')
        .where('comments.post.id = posts.id')
    }, 'count')
    .orderBy(sort === 'count' ? sort : 'posts.id', order)
    .loadRelationCountAndMap('posts.commentsCount', 'posts.comments')
    .take(limit)
    .getMany();
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
