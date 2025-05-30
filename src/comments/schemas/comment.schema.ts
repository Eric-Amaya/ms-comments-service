import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  activity: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
