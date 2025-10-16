// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Role } from '@prisma/client';
// import { ROLES_KEY } from '../role.decorator';

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
