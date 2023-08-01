import { Controller, Get, Post } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor() {}

  @Get()
  getPosts() {}

  @Post()
  createPost() {}

  
}
