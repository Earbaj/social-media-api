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
  .find({ author: { $in: [...followingList, new Types.ObjectId(userId)] } })
  .populate('author', 'username profilePic')
  .select('content likes createdAt') // Likes array-ta niye ashbe
  .sort({ createdAt: -1 })
  .exec();
}

async toggleLike(postId: string, userId: string) {
  const post = await this.postModel.findById(postId);
  if (!post) throw new Error('Post not found');

  // Check koro user ki agei like dise?
  const hasLiked = post.likes.includes(new Types.ObjectId(userId));

  if (hasLiked) {
    // Age like thakle sheta shorai dao (Unlike)
    await this.postModel.findByIdAndUpdate(postId, {
      $pull: { likes: new Types.ObjectId(userId) }
    });
    return { message: 'Post unliked' };
  } else {
    // Like na thakle add koro (Like)
    await this.postModel.findByIdAndUpdate(postId, {
      $addToSet: { likes: new Types.ObjectId(userId) }
    });
    return { message: 'Post liked' };
  }
}

}