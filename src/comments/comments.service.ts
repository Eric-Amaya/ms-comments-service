import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/comment.dto';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    return this.commentModel.create(dto);
  }

  async findByActivity(activityId: string){
    const comments = await this.commentModel
      .find({ activity: activityId })
      .sort({ createdAt: -1 })
      .lean();
    
    const enriched = await Promise.all(
      comments.map(async (comment) => {
        try {
          const user = await firstValueFrom(
            this.authClient.send('get-user-by-id', { _id: comment.user }),
          );

          return {
            ...comment,
            user: {
              _id: user._id,
              name: user.name,
            },
          };
        } catch {
          return {
            ...comment,
            user: {
              _id: comment.user,
              name: 'Usuario desconocido',
            },
          };
        }
      }),
    ); 
    return enriched; 
  }
}
