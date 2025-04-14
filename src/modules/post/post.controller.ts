import { Controller, Post as PostMethod, Get, Body, Param, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @PostMethod()
  async createPost(@User('userId') userId: string, @Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(userId, createPostDto);
  }

  @Get('user/:userId')
  async getPostsByUser(@Param('userId') userId: string) {
    return this.postService.getPostsByUser(userId);
  }
}