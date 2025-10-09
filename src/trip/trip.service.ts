import { Injectable } from '@nestjs/common';
import { TripDto } from './dto/trip.dto';

@Injectable()
export class TripService {
    // constructor(
        
    // ) {}

   async createNewTrip (tripDto: TripDto) {
      const {
        country,
        numberOfDays,
        travelStyle,
        interest,
        budget,
        groupType,
        userId} = tripDto
        
      const prompt = `Generate a ${country}`


   }
}
