import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsPositive,
  Min,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { NonShiftingHajjPackageStatus, NonShiftingHajjPackageTag } from '../enums/non-shifting-hajj-package.enum';

export class CreateNonShiftingHajjPackageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  durationDays: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  durationNights: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return String(value).split(',').map((v: string) => v.trim()).filter(Boolean);
  })
  @IsArray()
  @IsString({ each: true })
  locations?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return String(value).split(',').map((v: string) => v.trim()).filter(Boolean);
  })
  @IsArray()
  @IsEnum(NonShiftingHajjPackageTag, {
    each: true,
    message: `Each tag must be one of: ${Object.values(NonShiftingHajjPackageTag).join(', ')}`,
  })
  tags?: NonShiftingHajjPackageTag[];

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  perPersonText?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
  })
  @IsBoolean()
  popular?: boolean;

  @IsOptional()
  @IsEnum(NonShiftingHajjPackageStatus, {
    message: `status must be one of: ${Object.values(NonShiftingHajjPackageStatus).join(', ')}`,
  })
  status?: NonShiftingHajjPackageStatus;
}