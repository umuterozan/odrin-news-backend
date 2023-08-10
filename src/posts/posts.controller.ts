import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AccessTokenGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getPosts() {}

  @UseGuards(AccessTokenGuard)
  @Post('create')
  async createPost(@Body() dto: CreatePostDto, @GetCurrentUser('sub') userId: number) {
    const post = await this.postsService.create(dto, userId);
    if (post) return {
      success: true,
    }
  }
  
}
