import { IsEmail, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator'

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  AGENT = 'AGENT',
}
export class UserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string

  @IsOptional()
  @IsString()
  username?: string

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid profile URL' })
  profileUrl?: string

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of ADMIN, USER, AGENT' })
  role?: UserRole
}