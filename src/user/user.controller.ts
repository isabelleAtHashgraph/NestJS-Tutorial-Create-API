import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request) {
    console.log(
      '🚀 ~ file: user.controller.ts:10 ~ UserController ~ getMe ~ req:',
      req,
    );
    return req.user;
  }
}
