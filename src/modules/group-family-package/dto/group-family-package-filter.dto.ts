import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import {
  GroupFamilyPackageCategory,
  GroupFamilyPackageStarRating,
} from '../enums/group-family-package.enum';

export class GroupFamilyPackageFilterDto {
  @IsOptional()
  @IsEnum(GroupFamilyPackageCategory)
  category?: GroupFamilyPackageCategory;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsEnum(GroupFamilyPackageStarRating)
  starRating?: GroupFamilyPackageStarRating;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  popular?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;
}