import { Expose, Transform } from 'class-transformer';
import { UmrahPackageCategory, UmrahPackageStarRating } from '../enums/umrah-package.enum';

export class UmrahPackageResponseDto {
  @Expose()
  @Transform(({ obj }: { obj: { _id: unknown } }) => obj._id?.toString())
  _id: string;

  @Expose()
  title: string;

  @Expose()
  duration: string;

  @Expose()
  makkahHotel: string;

  @Expose()
  madinahHotel: string;

  @Expose()
  price: string;

  @Expose()
  imageUrl: string | null;

  @Expose()
  starRating: UmrahPackageStarRating;

  @Expose()
  category: UmrahPackageCategory;

  @Expose()
  includesFlight: boolean;

  @Expose()
  includesVisa: boolean;

  @Expose()
  includesTransport: boolean;

  @Expose()
  includesGuide: boolean;

  @Expose()
  isVip: boolean;

  @Expose()
  isCustom: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}