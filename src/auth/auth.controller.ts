import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from 'src/auth/dto';

@Controller('auth') //global prefix route
export class AuthController {
  constructor(private authService: AuthService) {
    this.authService.login();
  }
  //We expect a post request on sign up and sign in:
  @Post('signup') //route auth/signup
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto); //automatically converts datatype to string
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
