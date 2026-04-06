import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // 1. Post create kora
  async createPost(userId: string, content: string) {
    const newPost = new this.postModel({
      content,
      author: new Types.ObjectId(userId),
    });
    return newPost.save();
  }

  // 2. News Feed (Jei user-ke follow kori tader post)
  async getNewsFeed(userId: string) {
  // Database checking
  const user = await this.userModel.findById(userId);
  
  if (!user) {
    // Jodi user na paoa jay, tahole check koro userId thik ache ki na
    console.log("Debug: User ID not found in DB ->", userId);
    return []; // Khali feed return koro error na diye
  }

  const followingList = user.following || [];

  return this.postModel
    .find({
      author: { $in: [...followingList, new Types.ObjectId(userId)] },
    })
    .populate('author', 'username email')
    .sort({ createdAt: -1 })
    .exec();
}
}