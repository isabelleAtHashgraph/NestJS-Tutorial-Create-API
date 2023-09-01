import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('user')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    console.log(
      '🚀 ~ file: user.controller.ts:10 ~ UserController ~ getMe ~ req:',
      req,
    );
    return req.user;
  }
}
