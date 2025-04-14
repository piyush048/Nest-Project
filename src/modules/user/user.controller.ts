import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@User('userId') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateUserProfile(@User('userId') userId: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateUserProfile(userId, updateProfileDto);
  }
}