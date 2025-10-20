import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
constructor(
private readonly prisma: PrismaService,
private readonly jwtService: JwtService,
) {}

// User Registration
async register(registerDto: RegisterDto) {
const { email, username, profileUrl } = registerDto;

const foundUser = await this.prisma.user.findUnique({
  where: { email },
});

if (foundUser) {
  throw new ConflictException('User already exists! Please try a different email.');
}

const newUser = await this.prisma.user.create({
  data: {
    username,
    email,
    profileUrl
  },
}
);

return newUser;


}

// User Login
async login(loginDto: LoginDto) {
  const { email } = loginDto;

  const foundUser = await this.prisma.user.findUnique({
    where: { email },
  });

  if (!foundUser) {
    throw new UnauthorizedException('Invalid credentials. Please try again.');
  }

  const payload = { sub: foundUser.id, email: foundUser.email, username: foundUser.username, profileUrl: foundUser.profileUrl};  
  const token = this.jwtService.sign(payload);

  return {
    user: foundUser,
    token,
  };
}


 async validateGoogleUser(googleUser: RegisterDto) {
    
    const {email, username, profileUrl} = googleUser 

    const user = await this.prisma.user.findUnique({
        where: {email}
    })

    if(user) return user

      const newUser = await this.prisma.user.create({
        data: {email, username, profileUrl, role: 'USER'
        }})

        return newUser
      }}