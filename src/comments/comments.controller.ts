import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { AccessTokenGuard } from 'src/common/guards';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('create')
  async createComment(@Body() dto: CreateCommentDto, @GetCurrentUser('sub') userId: number) {
    const comment = await this.commentsService.create(dto, userId)
    if (comment) return {
      success: true,
    }
  }
}
