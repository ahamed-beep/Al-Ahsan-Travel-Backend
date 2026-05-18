import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UmrahPackageCategory, UmrahPackageStarRating } from '../enums/umrah-package.enum';

export class CreateUmrahPackageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  duration: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  makkahHotel: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  madinahHotel: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  price: string;

  @IsEnum(UmrahPackageStarRating)
  @Transform(({ value }) => Number(value))   // "3" → 3
  starRating: UmrahPackageStarRating;

  @IsEnum(UmrahPackageCategory)
  category: UmrahPackageCategory;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includesFlight?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includesVisa?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includesTransport?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includesGuide?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isVip?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isCustom?: boolean;
}