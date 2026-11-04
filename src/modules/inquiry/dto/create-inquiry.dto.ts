import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { InquiryType } from '../enums/inquiry.enum';

export class CreateInquiryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  @Transform(({ value }: { value: string }) => value?.trim())
  phone: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  departureDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  departureAirport?: string;

  @IsNotEmpty()
  @IsEnum(InquiryType)
  inquiryType: InquiryType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  packageTier?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  adults: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  children?: number;
}