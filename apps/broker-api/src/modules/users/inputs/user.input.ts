import { DefaultInput } from './../../../config/dto';
import {
  IsEmailField,
  ToLowerCase,
} from './../../../config/decorators/validation.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserInput {
  @ApiProperty({
    example: 'ชื่อ',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsEmailField({
    example: 'user@example.com',
  })
  @ToLowerCase()
  email: string;
}

export class CreateUserInput extends UserInput {
  @ApiProperty({
    example: 'รหัสผ่าน',
    required: false,
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'รหัสผ่าน',
    required: false,
  })
  @IsOptional()
  @IsString()
  confirm_password: string;
}

export class ChangeUserPasswordInput {
  @ApiProperty({
    example: 'รหัสผ่าน',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'รหัสผ่าน',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  confirm_password: string;
}

export class UpdateUserStatusInput extends UserInput {
  @ApiProperty({
    example: 'active or inactive',
    required: false,
  })
  @IsOptional()
  @IsString()
  status: string;
}

export class GetUserInput extends DefaultInput {
  @ApiProperty({
    example: 'รหัสผู้ใช้งาน (_id)',
    required: false,
  })
  @IsOptional()
  @IsString()
  user_id?: string;
}
