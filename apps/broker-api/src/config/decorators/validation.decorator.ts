import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';

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

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_HAS_LETTER_AND_NUMBER_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export function IsStrongPasswordField(options: FieldOptions = {}) {
  const { optional, ...apiPropertyOptions } = options;

  return applyDecorators(
    ApiProperty({
      example: 'Passw0rd',
      ...apiPropertyOptions,
      required: !optional,
    } as ApiPropertyOptions),
    optional ? IsOptional() : IsNotEmpty(),
    IsString(),
    MinLength(PASSWORD_MIN_LENGTH, {
      message: 'Password must be at least 8 characters long',
    }),
    Matches(PASSWORD_HAS_LETTER_AND_NUMBER_REGEX, {
      message: 'Password must contain at least one letter and one number',
    }),
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
