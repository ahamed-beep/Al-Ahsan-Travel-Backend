import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { BlogCategory } from '../enums/blog-category.enum';

export class QueryBlogDto {
  @IsOptional()
  @IsString()
  search?: string;

  // "All stories" frontend se aaye to ignore ho jayega (service me handle hai)
  @IsOptional()
  @IsString()
  category?: BlogCategory | 'All stories';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 9;

  // Sirf admin endpoint par use hota hai
  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  isPublished?: boolean;
}