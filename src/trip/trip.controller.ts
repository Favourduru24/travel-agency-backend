import { Body, Controller, Get, Post, UseGuards, Param, Query, ParseIntPipe, DefaultValuePipe} from '@nestjs/common';
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
      async getAllTrip(
        @Query('page') page = 1,
        @Query('limit') limit = 1
      ) {
        return this.tripService.getAllTrips(Number(page), Number(limit))
      } 

      // @Get('my-trips/:userId')
      // async getUserTrips(@Param('userId') userId: string) {
      //   return this.tripService.getUserTrips(Number(userId));
      // }

      @Get('my-trips/:id')
    async getUserTrips(
      @Param('id', ParseIntPipe) userId: number,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
      return this.tripService.getUserTrips(userId, page, limit);
    }
      @Get(':id')
      async getTripById(@Param('id') id: string) {
        return this.tripService.getTripById(Number(id));
      }

 
}