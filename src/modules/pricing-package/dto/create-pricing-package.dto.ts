// pricing-package/dto/create-pricing-package.dto.ts
import {
  IsString, IsBoolean, IsArray,
  IsOptional, IsEnum, ArrayNotEmpty,
} from 'class-validator';
import { PackageCategory } from '../enums/package-category.enum';

export class CreatePricingPackageDto {
  @IsString()
  duration: string;

  @IsString()
  title: string;

  @IsString()
  price: string;

  @IsBoolean()
  featured: boolean;

  @IsOptional()
  @IsString()
  badge?: string | null;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  features: string[];

  @IsEnum(PackageCategory)
  category: PackageCategory;
}