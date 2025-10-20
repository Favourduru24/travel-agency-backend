import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

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

   async updateUser(id: number, dto: UserDto) {
  const { email, username, profileUrl, role } = dto

  try {
    const updated = await this.prisma.user.update({
      where:  { id: Number(id) },
      data: {
        ...(email !== undefined && { email }),
        ...(username !== undefined && { username }),
        ...(profileUrl !== undefined && { profileUrl }),
        ...(role !== undefined && { role }),
      }
    })
    return updated
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}
}
