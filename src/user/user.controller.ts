import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor ( private readonly userService: UserService) {}
    @Get('get-all-user')
    async getAllUser () {
       return this.userService.getAllUsers()
    }
    @Patch(':id')
 update(
  @Param('id') id: number,
  @Body() dto: UserDto,
) {
  return this.userService.updateUser(id, dto)
}

}
