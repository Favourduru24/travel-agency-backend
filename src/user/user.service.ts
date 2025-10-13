import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllUsers () {
        try {
           return this.prisma.user.findMany({
            orderBy: {createdAt: 'desc'}
           })  
        } catch (error) {
          console.error('Something went wrong fetching users')  
        }
    }
}
