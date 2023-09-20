import { Controller, Get, Post, Body, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AccessTokenGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { PostEntity } from 'src/typeorm/entities';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('create')
  async createPost(@Body() dto: CreatePostDto, @GetCurrentUser('sub') userId: number) {
    const post = await this.postsService.create(dto, userId);
    if (post) return {
      message: 'successful',
    }
  }

  @Get()
  async getPosts(@Query('limit', ParseIntPipe) limit: number = 0, @Query('sort') sort: string = '', @Query('order') order: 'ASC' | 'DESC' = 'ASC') {
    const posts = await this.postsService.find(limit, sort, order)
    return this.formatPosts(posts)
  }

  formatPosts(posts: PostEntity[]) {
    const formattedPosts = []

    for (const post of posts) {
      const { category, user, ...postWithoutProps } = post
      const formattedPost = {
        ...postWithoutProps,
        category: post.category.name,
        user: post.user.username,
      }

      formattedPosts.push(formattedPost)
    }

    return formattedPosts
  }
}
