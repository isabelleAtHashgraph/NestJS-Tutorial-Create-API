import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') //global prefix route
export class AuthController {
  constructor(private authService: AuthService) {
    this.authService.login();
  }
  //We expect a post request on sign up and sign in:
  @Post('signup') //route auth/signup
  signup() {
    return this.authService.signup(); //automatically converts datatype to string
  }

  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
