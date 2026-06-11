import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export function ToLowerCase() {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  );
}

type IsUrlOptions = NonNullable<Parameters<typeof IsUrl>[0]>;

type FieldOptions = ApiPropertyOptions & { optional?: boolean };

export function IsEmailField(options: FieldOptions = {}) {
  const { optional, ...apiPropertyOptions } = options;

  return applyDecorators(
    ApiProperty({
      example: 'support@broker.com',
      ...apiPropertyOptions,
      required: !optional,
    } as ApiPropertyOptions),
    optional ? IsOptional() : IsNotEmpty(),
    IsString(),
    IsEmail(),
  );
}

type UrlFieldOptions = FieldOptions & { urlOptions?: IsUrlOptions };

export function IsUrlField(options: UrlFieldOptions = {}) {
  const { optional, urlOptions, ...apiPropertyOptions } = options;

  return applyDecorators(
    ApiProperty({
      example: 'https://broker.com',
      ...apiPropertyOptions,
      required: !optional,
    } as ApiPropertyOptions),
    optional ? IsOptional() : IsNotEmpty(),
    IsString(),
    IsUrl(urlOptions ?? { require_protocol: true }),
  );
}
