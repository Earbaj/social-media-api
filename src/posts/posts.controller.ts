import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
@UseGuards(AuthGuard('jwt')) // Eita thakar mane token chara ekhane dhuka jabena
export class PostsController {
  constructor(private postsService: PostsService) {}

  // Post kora
  @Post()
  async createPost(@Req() req, @Body('content') content: string) {
    // `req.user` ashbe amader strategy theke
    return this.postsService.createPost(req.user.userId, content);
  }

  // News Feed dekha
  @Get('feed')
  async getFeed(@Req() req) {
    return this.postsService.getNewsFeed(req.user.userId);
  }
}