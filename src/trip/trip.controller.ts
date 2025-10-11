import { Body, Controller, Get, Post, UseGuards, Param} from '@nestjs/common';
import { TripDto } from './dto/trip.dto';
import { TripService } from './trip.service';
import { JWTAuthGuard } from 'src/auth/jwt.auth.guard';

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

  @Get('my-trips/:userId')
  async getUserTrips(@Param('userId') userId: string) {
    return this.tripService.getUserTrips(Number(userId));
  }

  // ✅ Get one trip by ID
  @Get(':id')
  async getTripById(@Param('id') id: string) {
    return this.tripService.getTripById(Number(id));
  }
}
