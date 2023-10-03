import { Controller, Post, Get, Body, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { AccessTokenGuard } from 'src/common/guards';
import { CommentEntity } from 'src/typeorm/entities';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('create')
  async createComment(@Body() dto: CreateCommentDto, @GetCurrentUser('sub') userId: number) {
    const comment = await this.commentsService.create(dto, userId)
    if (comment) return {
      message: 'successful',
    }
  }

  @Get()
  async getComments(@Query('postId', ParseIntPipe) postId: number, @Query('limit', ParseIntPipe) limit: number = 0, @Query('order') order: 'ASC' | 'DESC' = 'ASC') {
    const comments = await this.commentsService.find(postId, limit, order)
    return this.formatComments(comments)
  }

  formatComments(comments: CommentEntity[]) {
    const formattedComments = []

    for (const comment of comments) {
      const { user, ...commentWithoutProps } = comment
      const formattedComment = {
        ...commentWithoutProps,
        user: comment.user.username,
      }

      formattedComments.push(formattedComment)
    }

    return formattedComments
  }
}
