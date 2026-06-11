import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInInput {
  @ApiProperty({
    example: 'chaing@kku.ac.th',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'Pass@w0rd',
    required: true,
  })
  @IsNotEmpty()
  @IsString({ message: 'Password must be a string.' })
  password: string;
}
