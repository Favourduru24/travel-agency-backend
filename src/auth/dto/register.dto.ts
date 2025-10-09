import {IsEmail, IsEmpty, IsUrl, } from 'class-validator'

export class RegisterDto {
 @IsEmail({}, {message: 'Please provide a valid email addess'})
   @IsEmpty({})
    email: string
 
    @IsEmpty({})
     username: string
 
     @IsUrl()
     profileUrl: string
}