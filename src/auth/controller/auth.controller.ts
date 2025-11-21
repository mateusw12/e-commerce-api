import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, Public, UserAccess } from 'src/common/decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { LoginDto } from '../dto/login.dto';
import { LogoutDto } from '../dto/logout.dto';
import { AuthService } from '../service/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Public()
  @Post('logout')
  async logout(@Body() body: LogoutDto) {
    return this.authService.logout(body.userId);
  }

  @Auth()
  @Get('profile')
  async getProfile(@UserAccess() user: UserEntity) {
    return {
      message: 'Autenticação funcionando!',
      user: user,
    };
  }
}
