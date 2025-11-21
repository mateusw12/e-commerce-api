import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../dto/usert.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
  private users: UserEntity[] = [];
  private nextId = 1;

  create(dto: UserDto): Omit<UserEntity, 'password'> {
    const exists = this.findByUsername(dto.username);
    if (exists) {
      throw new Error('Usuário já existe');
    }

    const hashedPassword = bcrypt.hashSync(dto.password, 10);

    const newUser: UserEntity = {
      id: this.nextId++,
      username: dto.username,
      password: hashedPassword,
    };

    this.users.push(newUser);

    // retorna sem senha
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  createOAuthUser(email: string, name?: string, image?: string): UserEntity {
    const newUser: UserEntity = {
      id: this.nextId++,
      username: email, // username = email para usuários Google
      password: null, // usuário do Google não tem senha
      name,
      image,
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll(): Omit<UserEntity, 'password'>[] {
    return this.users.map(({ password, ...rest }) => rest);
  }

  findOne(id: number): Omit<UserEntity, 'password'> {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');

    const { password, ...safeUser } = user;
    return safeUser;
  }

  findByUsername(username: string): UserEntity | undefined {
    return this.users.find((u) => u.username === username);
  }

  remove(id: number): void {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
