import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/user/entity/user.entity';

export const UserAccess = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserEntity; // tipagem forte
  },
);