import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateHajjInquiryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  @MaxLength(20)
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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  adults: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  children: number;
}