// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';

// interface DashboardStats {
//   totalUsers: number;
//   usersJoined: {
//     currentMonth: number;
//     lastMonth: number;
//   };
//   totalTrips: number;
//   tripsCreated: {
//     currentMonth: number;
//     lastMonth: number;
//   };
//   tripsByTravelStyle: { travelStyle: string; count: number }[];
// }

// @Injectable()
// export class DashboardService {
//   constructor(private readonly prisma: PrismaService) {}

//   private getMonthDateRange(offset: number = 0) {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
//     const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
//     return { start, end };
//   }

//   async getUsersAndTripsStats(): Promise<DashboardStats> {
//     const { start: startCurrent } = this.getMonthDateRange(0);
//     const { start: startPrev, end: endPrev } = this.getMonthDateRange(-1);

//     const [totalUsers, totalTrips, currentMonthUsers, lastMonthUsers, currentMonthTrips, lastMonthTrips] =
//       await Promise.all([
//         this.prisma.user.count(),
//         this.prisma.trip.count(),
//         this.prisma.user.count({
//           where: {
//             createdAt: { gte: startCurrent }, 
//           },
//         }),
//         this.prisma.user.count({
//           where: {
//             createdAt: { gte: startPrev, lte: endPrev },
//           },
//         }),
//         this.prisma.trip.count({
//           where: {
//             createdAt: { gte: startCurrent },
//           },
//         }),
//         this.prisma.trip.count({
//           where: {
//             createdAt: { gte: startPrev, lte: endPrev },
//           },
//         }),
//       ]);

//     const tripsByTravelStyleRaw = await this.prisma.trip.groupBy({
//       by: ['travelStyle'],
//       _count: { travelStyle: true },
//     });

//     const tripsByTravelStyle = tripsByTravelStyleRaw.map((item) => ({
//       travelStyle: item.travelStyle,
//       count: item._count.travelStyle,
//     }));

//     return {
//       totalUsers,
//       usersJoined: {
//         currentMonth: currentMonthUsers,
//         lastMonth: lastMonthUsers,
//       },
//       totalTrips,
//       tripsCreated: {
//         currentMonth: currentMonthTrips,
//         lastMonth: lastMonthTrips,
//       },
//       tripsByTravelStyle,
//     };
//   }

//   async getUserGrowthPerDay() {
//     const users = await this.prisma.user.findMany({
//       select: { createdAt: true },
//       orderBy: { createdAt: 'asc' },
//     });

//     const growth = users.reduce((acc, user) => {
//       const day = user.createdAt.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//       });
//       acc[day] = (acc[day] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     return Object.entries(growth).map(([day, count]) => ({ day, count }));
//   }

//   async getTripsCreatedPerDay() {
//     const trips = await this.prisma.trip.findMany({
//       select: { createdAt: true },
//       orderBy: { createdAt: 'asc' },
//     });

//     const growth = trips.reduce((acc, trip) => {
//       const day = trip.createdAt.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//       });
//       acc[day] = (acc[day] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     return Object.entries(growth).map(([day, count]) => ({ day, count }));
//   }

//   async getTripsByTravelStyle() {
//     const grouped = await this.prisma.trip.groupBy({
//       by: ['travelStyle'],
//       _count: { travelStyle: true },
//     });

//     return grouped.map((g) => ({
//       travelStyle: g.travelStyle,
//       count: g._count.travelStyle,
//     }));
//   }
// }


// import { Controller, Get } from '@nestjs/common';
// import { DashboardService } from './dashboard.service';

// @Controller('dashboard')
// export class DashboardController {
//   constructor(private readonly dashboardService: DashboardService) {}

//   @Get('stats')
//   async getDashboardStats() {
//     return this.dashboardService.getUsersAndTripsStats();
//   }

//   @Get('user-growth')
//   async getUserGrowth() {
//     return this.dashboardService.getUserGrowthPerDay();
//   }

//   @Get('trips-growth')
//   async getTripsGrowth() {
//     return this.dashboardService.getTripsCreatedPerDay();
//   }

//   @Get('travel-style')
//   async getTripsByTravelStyle() {
//     return this.dashboardService.getTripsByTravelStyle();
//   }
// }
// 🧠 What Changed vs Appwrite Version
// Appwrite	Prisma
// database.listDocuments()	prisma.model.findMany() or count()
// Manual JS filtering	SQL filtering via where: { createdAt: { gte, lte } }
// filterByDate() helper	Replaced by Prisma date conditions
// users.documents	Fetched directly from Prisma
// parseTripData(trip.tripDetails)	No longer needed — you already have structured travelStyle column
// Aggregate logic	Uses groupBy() for efficient counting in SQL

// ✅ Example Output
// json
// Copy code
// {
//   "totalUsers": 54,
//   "usersJoined": { "currentMonth": 8, "lastMonth": 11 },
//   "totalTrips": 122,
//   "tripsCreated": { "currentMonth": 14, "lastMonth": 21 },
//   "tripsByTravelStyle": [
//     { "travelStyle": "Adventure", "count": 42 },
//     { "travelStyle": "Luxury", "count": 25 },
//     { "travelStyle": "Backpacking", "count": 55 }
//   ]
// }
// Would you like me to also include NestJS module setup (DashboardModule + PrismaModule imports) so it plugs right into your project structure?








// //