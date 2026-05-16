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
import { ShiftingHajjPackageStatus } from '../enums/shifting-hajj-package.enum';

export class CreateShiftingHajjPackageDto {
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

  // multipart: "Makkah,Madinah" string ya array dono handle
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
  @IsString({ each: true })
  tags?: string[];

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
  @IsEnum(ShiftingHajjPackageStatus, {
    message: `status must be one of: ${Object.values(ShiftingHajjPackageStatus).join(', ')}`,
  })
  status?: ShiftingHajjPackageStatus;
}