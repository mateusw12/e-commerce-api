import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/service/user.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  private refreshTokens: Record<number, string> = {}; // userId -> refreshToken

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const user = this.userService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Usuário ou senha inválidos');

    const isPasswordValid = await bcrypt.compare(password, user.password ?? '');
    if (!isPasswordValid)
      throw new UnauthorizedException('Usuário ou senha inválidos');

    return user;
  }

  private async loginWithCredentials(dto: LoginDto) {
    const user = this.userService.findByUsername(dto.username ?? '');

    if (!user) throw new UnauthorizedException('Usuário não existe');

    const valid = await bcrypt.compare(dto.password ?? '', user.password ?? '');
    if (!valid) throw new UnauthorizedException('Senha inválida');

    return this.generateTokens(user);
  }

  private async loginWithGoogle(dto: LoginDto) {
    let user = this.userService.findByUsername(dto.email ?? '');

    if (!user) {
      // cria usuário google
      user = this.userService.createOAuthUser(
        dto.email ?? '',
        dto.name,
        dto.image,
      );
    }

    return this.generateTokens(user);
  }

  private generateTokens(user: UserEntity | undefined) {
    if (!user) {
      return new BadRequestException('Não foi possivel gerar o token');
    }
    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.refreshTokens[user.id] = refreshToken;

    return { accessToken, refreshToken, user };
  }

  async login(dto: LoginDto) {
    if (dto.type === 'credentials') {
      return this.loginWithCredentials(dto);
    }

    if (dto.type === 'google') {
      return this.loginWithGoogle(dto);
    }

    throw new UnauthorizedException('Tipo de login inválido');
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'chave_super_secreta',
      });

      const storedRefresh = this.refreshTokens[payload.sub];
      if (storedRefresh !== token) {
        throw new ForbiddenException('Refresh token inválido');
      }

      const newAccessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub },
        { expiresIn: '1m' },
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Token expirado ou inválido');
    }
  }

  async logout(userId: number) {
    delete this.refreshTokens[userId]; // invalida refresh token
    return { message: 'Logout realizado com sucesso' };
  }
}
