import { IsEmail, IsNotEmpty, IsUrl, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  AGENT = 'AGENT',
}

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Username is required'})
  username: string;
   
 @IsUrl({}, { message: 'Please provide a valid URL'})
  profileUrl: string;
}
