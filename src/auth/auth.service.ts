import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  //dependency injection
  constructor(private prisma: PrismaService) {}
  login() {}

  async signup(dto: AuthDto) {
    //create a user using POST route in auth.controller that has email and password and response is authentication
    //Generate hash for password using argon
    try {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          //tried to create a record that already exists
          console.log('Unique constraint failed on the fields: (`email`)');
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    //if the user doesn't exist throw an exception
    if (!user) throw new ForbiddenException('Credentials incorrect');
    //compare the passwords
    const pwMatches = await argon.verify(user.hash, dto.password);
    //if password incorrect, throw an exception
    if (!pwMatches) throw new ForbiddenException('Password incorrect');
    //send back the user
    delete user.hash;
    return user;
  }
}
