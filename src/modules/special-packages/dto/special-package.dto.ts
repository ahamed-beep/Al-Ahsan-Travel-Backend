// dto/special-package.dto.ts

import { Transform, Type } from 'class-transformer';
import {
  IsEnum, IsString, IsNotEmpty, IsNumber,
  IsOptional, IsBoolean, IsArray, Min,
  ValidateNested, ArrayNotEmpty, IsObject,
} from 'class-validator';
import { PackageCategory, StarRating, PackageBadge } from '../enums/special-package.enum';

export class HotelInfoDto {
  @IsString()
  @IsNotEmpty()
  makkah: string;

  @IsString()
  @IsNotEmpty()
  madinah: string;
}

export class CreateSpecialPackageDto {
  @IsEnum(PackageCategory)
  category: PackageCategory;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(StarRating)
  @Type(() => Number)
  stars: StarRating;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  nights: number;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsOptional()
  originalPrice?: string;

  @IsString()
  @IsOptional()
  discount?: string;

  // JSON string ko object mein parse karo
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return value; }
    }
    return value;
  })
  @ValidateNested()
  @Type(() => HotelInfoDto)
  hotels: HotelInfoDto;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  features: string[];

  @IsString()
  @IsOptional()  // Optional because file upload sets it in controller
  image?: string;

  @IsEnum(PackageBadge)
  @IsOptional()
  badge?: PackageBadge;

  @IsBoolean()
  @IsOptional()
 @Transform(({ value }) => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return Boolean(value);
})
  isPopular?: boolean;

  @IsBoolean()
  @IsOptional()
@Transform(({ value }) => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return Boolean(value);
})
  isActive?: boolean;
}

export class UpdateSpecialPackageDto {
  @IsEnum(PackageCategory)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  category?: PackageCategory;

  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(StarRating)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  stars?: StarRating;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  nights?: number;

  @IsString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  originalPrice?: string;

  @IsString()
  @IsOptional()
  discount?: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return value; }
    }
    return value;
  })
  @ValidateNested()
  @Type(() => HotelInfoDto)
  @IsOptional()
  hotels?: HotelInfoDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  features?: string[];

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(PackageBadge)
  @IsOptional()
  badge?: PackageBadge;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return Boolean(value);
  })
  isPopular?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return Boolean(value);
  })
  isActive?: boolean;
}

export class FilterSpecialPackageDto {
  @IsEnum(PackageCategory)
  @IsOptional()
  category?: PackageCategory;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}