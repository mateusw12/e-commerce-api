import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // pega token do header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'chave_super_secreta', // mesma chave do JwtModule
    });
  }

  async validate(payload: any): Promise<UserEntity> {
    // o objeto retornado aqui será injetado no request.user
    return {
      id: payload.sub,
      username: payload.username,
      password: payload.password,
    };
  }
}