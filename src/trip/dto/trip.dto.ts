import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class TripDto {
  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  travelStyle: string;

  @IsNotEmpty()
  @IsString()
  numberOfDays: string;

  @IsNotEmpty()
  @IsString()
  interests: string;

  @IsNotEmpty()
  @IsString()
  budget: string;

  @IsNotEmpty()
  @IsString()
  groupType: string;

  @IsNotEmpty()
  userId: number;
}