import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { UmrahPackageCategory, UmrahPackageStarRating } from '../enums/umrah-package.enum';

export class UmrahPackageFilterDto {
  @IsEnum(UmrahPackageCategory)
  @IsOptional()
  category?: UmrahPackageCategory;

  @IsEnum(UmrahPackageStarRating)
  @IsOptional()
  @Transform(({ value }: { value: string }) => Number(value))
  starRating?: UmrahPackageStarRating;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  includesFlight?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  isActive?: boolean;
}