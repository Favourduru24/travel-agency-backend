import { Body, Controller, Get, Post, UseGuards, Param} from '@nestjs/common';
import { TripDto } from './dto/trip.dto';
import { TripService } from './trip.service';
import { JWTAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('trip')
export class TripController {
    constructor(
         private readonly tripService: TripService
    ) {}
    @Post('/create-trip')
     async createTrip(@Body() tripDto: TripDto) {
       return this.tripService.createNewTrip(tripDto)
     }

      @Get('all-trip')
      async getAllTrip() {
        return this.tripService.getAllTrips()
      } 

      @Get('my-trips/:userId')
      async getUserTrips(@Param('userId') userId: string) {
        return this.tripService.getUserTrips(Number(userId));
      }

    
      @Get(':id')
      async getTripById(@Param('id') id: string) {
        return this.tripService.getTripById(Number(id));
      }

 
}
