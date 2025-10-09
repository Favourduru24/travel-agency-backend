import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { LoginDto } from './dto/login.dto';
import { JWTAuthGuard} from './jwt.auth.guard';

// @Controller('auth')
// export class AuthController {
//     constructor(
//         private readonly authService: AuthService
//     ) {}

//     @Post('register-user')
//     async register(@Body() registerDto: RegisterDto) {
//        return this.authService.register(registerDto)
//     }

//     @Post('login-user')
//     async login(@Body() loginDto: RegisterDto) {
//         return this.authService.login(loginDto)
//     }

//     @UseGuards(GoogleAuthGuard)
//     @Get('google/login')
//     googleLogin() {

//     }

//     @UseGuards(GoogleAuthGuard)
//     @Get('google/callback')
//    async googleCallback(@Req() req, @Res() res) {

//        const user = req.user; // populated by GoogleAuthGuard

//   // now generate your JWT token
//   const response = await this.authService.login({ email: user.email });
         
//          res.redirect(`http://localhost:3000?token=${response.token}`)

//         console.log({email: user.email})
//     }

//      @UseGuards(JWTAuthGuard)
//     @Get('me')
//     getMe(@Req() req) {
//     return req.user;
//     }
// }

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-user')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login-user')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {
    // This triggers the Google OAuth flow
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const user = req.user;
    const response = await this.authService.login({ email: user.email });
    res.redirect(`http://localhost:3000?token=${response.token}`);
  }

  @UseGuards(JWTAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }
}
