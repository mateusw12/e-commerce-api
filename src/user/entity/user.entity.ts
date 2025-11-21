export class UserEntity {
  id: number;
  username: string;                 
  password: string | null; // usuários Google não têm senha
  name?: string;
  image?: string;
}
