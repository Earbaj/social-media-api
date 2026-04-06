import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('follow/:id')
  async follow(@Req() req, @Param('id') targetUserId: string) {
    return this.usersService.toggleFollow(req.user.userId, targetUserId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyProfile(@Req() req) {
    return this.usersService.getProfile(req.user.userId);
  }
}