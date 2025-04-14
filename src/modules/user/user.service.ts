import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {User}  from './entities/user.entity'
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findById(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async create(userDto: { email: string; password: string; name?: string }) {
    const user = new this.userModel(userDto);
    return user.save();
  }

  async getUserProfile(userId: string) {
    const user = await this.findById(userId);
    return { id: user._id, email: user.email, name: user.name, avatar: user.avatar };
  }

  async updateUserProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.findById(userId);
    Object.assign(user, updateProfileDto);
    return user.save();
  }
}