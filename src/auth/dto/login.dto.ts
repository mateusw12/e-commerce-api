import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

export class LoginDto {
  @ApiProperty({ enum: ['credentials', 'google'] })
  @IsEnum(['credentials', 'google'])
  type: 'credentials' | 'google';

  @ApiProperty({ required: false })
  @IsOptional()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  image?: string;
}
