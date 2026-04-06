import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async followUser(currentUserId: string, targetUserId: string) {
    // Current user-er following list-e target ke add kora
    await this.userModel.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: new Types.ObjectId(targetUserId) }
    });
    // Target user-er follower list-e current user ke add kora
    await this.userModel.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: new Types.ObjectId(currentUserId) }
    });
    return { message: 'Followed successfully' };
  }

  async getProfile(username: string) {
    return this.userModel.findOne({ username }).populate('followers following', 'username profilePic');
  }
 
  async findAll() {
    return this.userModel.find().exec();
  }
}