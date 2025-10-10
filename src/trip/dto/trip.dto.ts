import {IsEmpty, IsInt, } from 'class-validator'

export class TripDto {
  @IsEmpty()
  @IsEmpty()
  country: string
   
  @IsEmpty()
  @IsEmpty()
  numberOfDays: string
   
  @IsEmpty()
  @IsEmpty()
  travelStyle: string
   
  @IsEmpty()
  @IsEmpty()
  interests: string
   
  @IsEmpty()
  @IsEmpty()
  budget: string
   
  @IsEmpty()
  @IsEmpty()
  groupType: string

  @IsEmpty()
  @IsInt()
  userId: number
}