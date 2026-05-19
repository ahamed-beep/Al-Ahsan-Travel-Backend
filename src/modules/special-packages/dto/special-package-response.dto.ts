import { Expose, Type, Transform } from 'class-transformer';
import { PackageCategory, StarRating, PackageBadge } from '../enums/special-package.enum';

class HotelInfoResponseDto {
  @Expose()
  makkah: string;

  @Expose()
  madinah: string;
}

export class SpecialPackageResponseDto {
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id?.toString())
  _id: string;

  @Expose()
  category: PackageCategory;

  @Expose()
  title: string;

  @Expose()
  stars: StarRating;

  @Expose()
  nights: number;

  @Expose()
  price: string;

  @Expose()
  originalPrice?: string;

  @Expose()
  discount?: string;

  @Expose()
  @Type(() => HotelInfoResponseDto)
  hotels: HotelInfoResponseDto;

  @Expose()
  features: string[];

  @Expose()
  image: string;

  @Expose()
  badge?: PackageBadge;

  @Expose()
  isPopular: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}