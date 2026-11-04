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
import { Type, Transform } from 'class-transformer';
import { HajjInquiryType } from '../enums/hajj-inquiry.enum';

export class CreateHajjInquiryDto {
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
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  packageType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  hotelCategory?: string;

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
  @IsEnum(HajjInquiryType)
  inquiryType: HajjInquiryType;

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