import {IsEmail, IsEmpty, IsUrl, } from 'class-validator'

export class LoginDto {
  @IsEmail({}, {message: 'Please provide a valid email addess'})
  @IsEmpty({})
  email: string
}