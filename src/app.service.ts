import { Injectable } from '@nestjs/common';
import { Public } from './common/decorator';

@Injectable()
export class AppService {

  @Public()
  getHello(): string {
    return 'Hello World!';
  }
}
