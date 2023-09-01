import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  //dependency injection
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
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

      return this.signToken(user.id, user.email);
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
    return this.signToken(user.id, user.email);
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '20m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
