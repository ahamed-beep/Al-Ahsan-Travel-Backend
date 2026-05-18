import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  GroupFamilyPackageCategory,
  GroupFamilyPackageStarRating,
} from '../enums/group-family-package.enum';

// ✅ "false" string → false, "true" string → true
const toBool = () =>
  Transform(({ value }) => value === 'true' || value === true);

export class CreateGroupFamilyPackageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  makkahHotel: string;

  @IsString()
  @IsNotEmpty()
  madinahHotel: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  hotelLabel: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsEnum(GroupFamilyPackageStarRating)
  starRating: GroupFamilyPackageStarRating;

  @IsEnum(GroupFamilyPackageCategory)
  category: GroupFamilyPackageCategory;

  @toBool()
  @IsBoolean()
  @IsOptional()
  popular?: boolean;

  @toBool()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @toBool()
  @IsBoolean()
  @IsOptional()
  includesFlight?: boolean;

  @toBool()
  @IsBoolean()
  @IsOptional()
  includesVisa?: boolean;

  @toBool()
  @IsBoolean()
  @IsOptional()
  includesTransport?: boolean;

  @toBool()
  @IsBoolean()
  @IsOptional()
  includesGuide?: boolean;
}