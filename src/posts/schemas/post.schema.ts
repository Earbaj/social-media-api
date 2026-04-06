import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  content: string;

  // Post-ta k korsi shetar User ID
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  // Kara kara like dise tader ID-r list
  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  likes: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);