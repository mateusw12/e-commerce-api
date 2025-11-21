import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, Public } from 'src/common/decorator';
import { UserDto } from '../dto/usert.dto';
import { UserService } from '../service/user.service';

@ApiTags("User")
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(@Body() dto: UserDto) {
    return this.userService.create(dto);
  }

  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
