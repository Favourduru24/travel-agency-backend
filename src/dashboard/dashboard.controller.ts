import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats() {
    return this.dashboardService.getUsersAndTripsStats();
  }

  @Get('user-growth')
  async getUserGrowth() {
    return this.dashboardService.getUserGrowthPerDay();
  }

  @Get('trips-growth')
  async getTripsGrowth() {
    return this.dashboardService.getTripsCreatedPerDay();
  }

  @Get('travel-style')
  async getTripsByTravelStyle() {
    return this.dashboardService.getTripsByTravelStyle();
  }
}