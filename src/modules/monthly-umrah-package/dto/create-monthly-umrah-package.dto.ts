import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UmrahMonth, StarCategory } from '../enums/umrah-month.enum';

export class CreatePackageItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  makkahHotel: string;

  @IsString()
  @IsNotEmpty()
  madinahHotel: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;
}

export class CreateMonthlyUmrahPackageDto {
  @IsEnum(UmrahMonth, {
    message: `month must be one of: ${Object.values(UmrahMonth).join(', ')}`,
  })
  month: UmrahMonth;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsEnum(StarCategory, {
    message: `starCategory must be 3, 4, or 5`,
  })
  starCategory: StarCategory;

  @IsString()
  @IsNotEmpty()
  sectionTitle: string;

  @IsString()
  @IsNotEmpty()
  sectionSubtitle: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => CreatePackageItemDto)
  packages: CreatePackageItemDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;
}