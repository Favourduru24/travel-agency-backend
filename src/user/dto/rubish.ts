// // src/dashboard/dashboard.service.ts
// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { Role as UserRole } from '@prisma/client'; // Prisma enum for User.role

// export interface DashboardStats {
//   totalUsers: number;
//   usersJoined: {
//     currentMonth: number;
//     lastMonth: number;
//   };
//   userRole: {
//     total: number;
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

//   private getMonthDateRange(offset = 0) {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
//     const end = new Date(
//       now.getFullYear(),
//       now.getMonth() + offset + 1,
//       0,
//       23,
//       59,
//       59,
//       999,
//     );
//     return { start, end };
//   }

//   async getUsersAndTripsStats(): Promise<DashboardStats> {
//     const { start: startCurrent } = this.getMonthDateRange(0);
//     const { start: startPrev, end: endPrev } = this.getMonthDateRange(-1);

//     const [
//       totalUsers,
//       totalTrips,
//       currentMonthUsers,
//       lastMonthUsers,
//       currentMonthTrips,
//       lastMonthTrips,
//       totalUsersWithRoleUser, //
//       currentMonthUsersWithRoleUser,//
//       lastMonthUsersWithRoleUser,//
//     ] = await Promise.all([
//       this.prisma.user.count(),
//       this.prisma.trip.count(),
//       // users created this month
//       this.prisma.user.count({
//         where: { createdAt: { gte: startCurrent } },
//       }),
//       // users created last month
//       this.prisma.user.count({
//         where: { createdAt: { gte: startPrev, lte: endPrev } },
//       }),
//       // trips created this month
//       this.prisma.trip.count({
//         where: { createdAt: { gte: startCurrent } },
//       }),
//       // trips created last month
//       this.prisma.trip.count({
//         where: { createdAt: { gte: startPrev, lte: endPrev } },
//       }),
//       // total users with role USER
//       this.prisma.user.count({
//         where: { role: UserRole.USER },
//       }),
//       // users with role USER this month
//       this.prisma.user.count({
//         where: { role: UserRole.USER, createdAt: { gte: startCurrent } },
//       }),
//       // users with role USER last month
//       this.prisma.user.count({
//         where: { role: UserRole.USER, createdAt: { gte: startPrev, lte: endPrev } },
//       }),
//     ]);

//     const tripsByTravelStyleRaw = await this.prisma.trip.groupBy({
//       by: ['travelStyle'],
//       _count: { travelStyle: true },
//       where: { travelStyle: { not: null } },
//     });

//     const tripsByTravelStyle = tripsByTravelStyleRaw.map((item) => ({
//       travelStyle: item.travelStyle ?? 'Unknown',
//       count: item._count.travelStyle,
//     }));

//     return {
//       totalUsers,
//       usersJoined: {
//         currentMonth: currentMonthUsers,
//         lastMonth: lastMonthUsers,
//       },
//       userRole: {
//         total: totalUsersWithRoleUser,
//         currentMonth: currentMonthUsersWithRoleUser,
//         lastMonth: lastMonthUsersWithRoleUser,
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

//     const growth = users.reduce((acc: Record<string, number>, user) => {
//       const day = user.createdAt.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//       });
//       acc[day] = (acc[day] || 0) + 1;
//       return acc;
//     }, {});

//     return Object.entries(growth).map(([day, count]) => ({ day, count }));
//   }

//   async getTripsCreatedPerDay() {
//     const trips = await this.prisma.trip.findMany({
//       select: { createdAt: true },
//       orderBy: { createdAt: 'asc' },
//     });

//     const growth = trips.reduce((acc: Record<string, number>, trip) => {
//       const day = trip.createdAt.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//       });
//       acc[day] = (acc[day] || 0) + 1;
//       return acc;
//     }, {});

//     return Object.entries(growth).map(([day, count]) => ({ day, count }));
//   }

//   async getTripsByTravelStyle() {
//     const grouped = await this.prisma.trip.groupBy({
//       by: ['travelStyle'],
//       _count: { travelStyle: true },
//       where: { travelStyle: { not: null } },
//     });

//     return grouped.map((g) => ({
//       travelStyle: g.travelStyle ?? 'Unknown',
//       count: g._count.travelStyle,
//     }));
//   }
// }
