import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DefaultInput {
  @ApiProperty({
    description: 'Limit number',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Skip record number',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    example: 'คำค้นหา',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Start date for filtering (ISO format)',
    example: '2025-04-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @ApiProperty({
    description: 'End date for filtering (ISO format)',
    example: '2025-04-30T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date;
}

export class LangInput {
  @ApiProperty({
    example: 'ภาษาไทย',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  th: string;

  @ApiProperty({
    example: 'English',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  us: string;
}
