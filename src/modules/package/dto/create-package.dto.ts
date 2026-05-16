import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsPositive,
  Min,
  IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PackageStatus } from '../enums/package.enum';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  durationDays: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  durationNights: number;

  // multipart/form-data mein array string aa sakti hai "Visa,Hotel,Meals"
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') return value.split(',').map((v) => v.trim()).filter(Boolean);
    if (Array.isArray(value)) return value;
    return [];
  })
  tags?: string[];

  @IsOptional()
  @IsString()
  perPersonText?: string;

  @IsOptional()
  @IsEnum(PackageStatus, {
    message: `status must be one of: ${Object.values(PackageStatus).join(', ')}`,
  })
  status?: PackageStatus;

  @IsOptional()
  @IsString()
  description?: string;
}