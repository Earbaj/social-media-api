import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Follow/Unfollow Logic
  async toggleFollow(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) throw new Error("You can't follow yourself");

    const user = await this.userModel.findById(currentUserId);
    if (!user) throw new NotFoundException('Current user not found');

    const isFollowing = user.following.includes(new Types.ObjectId(targetUserId));

    if (isFollowing) {
      // Unfollow kora (Pull from array)
      await this.userModel.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
      await this.userModel.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
      return { message: 'Unfollowed successfully' };
    } else {
      // Follow kora (Add to set - ensures no duplicates)
      await this.userModel.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
      await this.userModel.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
      return { message: 'Followed successfully' };
    }
  }

  // Profile data dekha
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId)
      .select('-password') // Password hide rakha
      .populate('followers following', 'username profilePic');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}