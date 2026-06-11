import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { BrokerTypeEnum } from './../../../config/constants';
import { DefaultInput, LangInput } from './../../../config/dto';

export class ContentsInput {
  @ApiProperty({
    type: LangInput,
  })
  @ValidateNested()
  @Type(() => LangInput)
  title: LangInput;

  @ApiProperty({
    type: [LangInput],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LangInput)
  paragraph: LangInput[];
}

export class ContactDetailInput {
  @ApiProperty({
    example: 'Bangkok, Thailand',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'support@broker.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'https://broker.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  web_site: string;
}

export class CreateBrokerInput {
  @ApiProperty({
    type: LangInput,
    required: true,
  })
  @ValidateNested()
  @Type(() => LangInput)
  name: LangInput;

  @ApiProperty({
    type: LangInput,
    required: true,
  })
  @ValidateNested()
  @Type(() => LangInput)
  desc: LangInput;

  @ApiProperty({
    example: 'exness',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'slug must contain only lowercase letters, numbers and hyphens',
  })
  slug: string;

  @ApiProperty({
    enum: BrokerTypeEnum,
    example: BrokerTypeEnum.CFD,
    required: true,
  })
  @IsEnum(BrokerTypeEnum, {
    message: `broker_type must be one of: ${Object.values(BrokerTypeEnum).join(', ')}`,
  })
  broker_type: BrokerTypeEnum;

  @ApiProperty({
    example: 'https://cdn.example.com/logo.png',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  logo_url: string;

  @ApiProperty({
    example: 'Global',
  })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({
    type: ContentsInput,
  })
  @ValidateNested()
  @Type(() => ContentsInput)
  content_detail: ContentsInput;

  @ApiProperty({
    type: ContactDetailInput,
  })
  @ValidateNested()
  @Type(() => ContactDetailInput)
  contact_detail: ContactDetailInput;
}

export class GetBrokerInput extends DefaultInput {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'cfd',
    required: false,
  })
  type?: string;
}

export class UpdateSlugInput {
  @ApiProperty({
    example: 'exness',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  slug: string;
}
