import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';


@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern('create_comment')
  create(dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @MessagePattern('get_comments')
  getByActivity(activityId: string) {
    return this.commentsService.findByActivity(activityId);
  }
}