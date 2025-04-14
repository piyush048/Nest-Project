import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly userService: UserService,
  ) {}

  async createPost(userId: string, createPostDto: CreatePostDto) {
    await this.userService.findById(userId);
    const post = new this.postModel({ ...createPostDto, userId });
    return post.save();
  }

  async getPostsByUser(userId: string) {
    await this.userService.findById(userId);
    return this.postModel.find({ userId }).exec();
  }
}