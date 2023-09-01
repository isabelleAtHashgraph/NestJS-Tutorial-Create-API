import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  //dependency injection
  constructor(private prisma: PrismaService) {}
  login() {}
  async signup(dto: AuthDto) {
    //create a user using POST route in auth.controller that has email and password and response is authentication
    //Generate hash for password using argon
    const hash = await argon.hash(dto.password);
    //save the new user in the db
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });
    delete user.hash;
    //return the saved user

    return user;
  }
  signin() {
    return { msg: ' I have signed in' };
  }
}
