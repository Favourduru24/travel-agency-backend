import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TripDto } from './dto/trip.dto';
import { TripService } from './trip.service';

@Controller('trip')
export class TripController {
    constructor(
         private readonly tripService: TripService
    ) {}
    @Get()
    getTrip() {

    }

    @Post('/create-trip')
     async createTrip(@Body() tripDto: TripDto) {
       return this.tripService.createNewTrip(tripDto)
     }
}
