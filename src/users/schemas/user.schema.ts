
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: '' })
  bio: string;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  followers: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  following: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);