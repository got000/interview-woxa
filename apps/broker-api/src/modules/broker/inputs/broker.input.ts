import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { BrokerTypeEnum, StatusEnum } from './../../../config/constants';
import { DefaultInput, LangInput } from './../../../config/dto';
import {
  IsEmailField,
  IsUrlField,
  ToLowerCase,
} from './../../../config/decorators/validation.decorator';

export class ContentsInput {
  @ApiProperty({
    type: LangInput,
    example: { th: 'รายละเอียดโบรกเกอร์', en: 'Broker overview' },
  })
  @ValidateNested()
  @Type(() => LangInput)
  title: LangInput;

  @ApiProperty({
    type: [LangInput],
    example: [
      {
        th: 'เนื้อหารายละเอียดโบรกเกอร์',
        en: 'Broker detail content',
      },
    ],
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

  @IsEmailField({
    example: 'support@broker.com',
  })
  @ToLowerCase()
  email: string;

  @IsUrlField({
    example: 'https://broker.com',
  })
  web_site: string;
}

export class CreateBrokerInput {
  @ApiProperty({
    type: LangInput,
    required: true,
    example: { th: 'โบรกเกอร์ตัวอย่าง', en: 'Sample Broker' },
  })
  @ValidateNested()
  @Type(() => LangInput)
  name: LangInput;

  @ApiProperty({
    type: LangInput,
    required: true,
    example: {
      th: 'คำอธิบายโบรกเกอร์ตัวอย่าง',
      en: 'Sample broker description',
    },
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

  @IsUrlField({
    example: 'https://cdn.example.com/logo.png',
  })
  logo_url: string;

  @ApiProperty({
    example: 'Global',
  })
  @IsString()
  @IsNotEmpty()
  @ToLowerCase()
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

  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${Object.values(StatusEnum).join(', ')}`,
  })
  @ApiProperty({
    enum: StatusEnum,
    example: StatusEnum.ACTIVE,
    required: false,
  })
  status?: StatusEnum;
}

export class UpdateSlugInput {
  @ApiProperty({
    example: 'exness',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @ToLowerCase()
  slug: string;
}

export class UpdateBrokerStatusInput {
  @ApiProperty({
    enum: StatusEnum,
    example: StatusEnum.INACTIVE,
    required: true,
  })
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${Object.values(StatusEnum).join(', ')}`,
  })
  status: StatusEnum;
}
