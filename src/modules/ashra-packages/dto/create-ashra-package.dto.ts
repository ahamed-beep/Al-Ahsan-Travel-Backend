import {
  IsString,
  IsInt,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsArray,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AshraCategoryEnum } from '../enums/ashra-category.enum';

export class CreateAshraPackageDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(50)
  price: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  nights: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  @MaxLength(255)
  makkah: string;

  @IsString()
  @MaxLength(255)
  madinah: string;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  badge?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  badgeBg?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  borderColor?: string;

  @IsEnum(AshraCategoryEnum)
  category: AshraCategoryEnum;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPopular: boolean;
}