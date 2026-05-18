import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UmrahPackageCategory, UmrahPackageStarRating } from '../enums/umrah-package.enum';

export class UpdateUmrahPackageDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  duration?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  makkahHotel?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  madinahHotel?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  price?: string;

  @IsEnum(UmrahPackageStarRating)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  starRating?: UmrahPackageStarRating;

  @IsEnum(UmrahPackageCategory)
  @IsOptional()
  category?: UmrahPackageCategory;

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

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}