// pricing-package/dto/response-pricing-package.dto.ts
import { Expose, Transform } from 'class-transformer';
import { PackageCategory } from '../enums/package-category.enum';

export class ResponsePricingPackageDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  _id: string;

  @Expose()
  duration: string;

  @Expose()
  title: string;

  @Expose()
  price: string;

  @Expose()
  featured: boolean;

  @Expose()
  badge: string | null;

  @Expose()
  features: string[];

  @Expose()
  category: PackageCategory;
}