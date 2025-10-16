// model User {
//   id         Int       @id @default(autoincrement())
//   email      String    @unique
//   username   String
//   profileUrl String
//   role       Role      @default(USER)  // 👈 Add this
//   createdAt  DateTime  @default(now())
//   updatedAt  DateTime  @updatedAt
//   trips      Trip[]
// }

// enum Role {
//   ADMIN
//   AGENT
//   USER
// }

// // auth.service.ts
// import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from '../prisma/prisma.service';
// import { Injectable, UnauthorizedException } from '@nestjs/common';

// @Injectable()
// export class AuthService {
//   constructor(
//     private prisma: PrismaService,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, password: string) {
//     const user = await this.prisma.user.findUnique({ where: { email } });
//     if (!user) throw new UnauthorizedException('Invalid credentials');

//     // TODO: validate password here

//     return user;
//   }

//   async login(user: any) {
//     const payload = { sub: user.id, email: user.email, role: user.role };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }
// }

// // roles.decorator.ts
// import { SetMetadata } from '@nestjs/common';
// import { Role } from '@prisma/client'; // uses the enum from Prisma

// export const ROLES_KEY = 'roles';
// export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);


// // roles.guard.ts
// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from './roles.decorator';
// import { Role } from '@prisma/client';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles || requiredRoles.length === 0) {
//       return true; // no role restriction
//     }

//     const { user } = context.switchToHttp().getRequest();
//     return requiredRoles.includes(user.role);
//   }
// }

// // auth/jwt-auth.guard.ts
// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}


// // dashboard.controller.ts
// import { Controller, Get, UseGuards } from '@nestjs/common';
// import { DashboardService } from './dashboard.service';
// import { Roles } from '../auth/roles.decorator';
// import { RolesGuard } from '../auth/roles.guard';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { Role } from '@prisma/client';

// @Controller('dashboard')
// @UseGuards(JwtAuthGuard, RolesGuard) // applies globally to this controller
// export class DashboardController {
//   constructor(private readonly dashboardService: DashboardService) {}

//   @Get('stats')
//   @Roles(Role.ADMIN, Role.AGENT) // only admin and agent can access
//   async getStats() {
//     return this.dashboardService.getUsersAndTripsStats();
//   }

//   @Get('user-growth')
//   @Roles(Role.ADMIN)
//   async getUserGrowth() {
//     return this.dashboardService.getUserGrowthPerDay();
//   }

//   @Get('trips-growth')
//   @Roles(Role.ADMIN, Role.AGENT)
//   async getTripsGrowth() {
//     return this.dashboardService.getTripsCreatedPerDay();
//   }
// }

// // auth/jwt.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_SECRET,
//     });
//   }

//   async validate(payload: any) {
//     // this object becomes `req.user`
//     return { userId: payload.sub, email: payload.email, role: payload.role };
//   }
// }


// import { APP_GUARD } from '@nestjs/core';

// @Module({
//   providers: [
//     { provide: APP_GUARD, useClass: JwtAuthGuard },
//     { provide: APP_GUARD, useClass: RolesGuard },
//   ],
// })
// export class AppModule {}
