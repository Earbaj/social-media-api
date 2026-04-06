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
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const followingList = user.following || [];

    // Shudhu amar o amar following der post ashbe
    return this.postModel
      .find({
        author: { $in: [...followingList, new Types.ObjectId(userId)] },
      })
      .populate('author', 'username email') // Author-er profile details show korbe
      .sort({ createdAt: -1 }) // Newest post first
      .exec();
  }
}