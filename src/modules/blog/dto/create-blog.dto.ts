import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { BlogCategory } from '../enums/blog-category.enum';

const toBoolean = ({ value }: { value: unknown }): boolean | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return value as boolean;
};

// Empty value means "calculate automatically"
const toOptionalNumber = ({ value }: { value: unknown }): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  return Number(value);
};

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsEnum(BlogCategory)
  category: BlogCategory;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  // Read time in minutes. If omitted, it is calculated from the body.
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  @Max(120)
  readTimeMinutes?: number;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isFeatured?: boolean;
}