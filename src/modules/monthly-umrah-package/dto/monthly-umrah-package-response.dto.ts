import { Expose, Type, Transform } from 'class-transformer';

export class PackageItemResponseDto {
  @Expose()
  title: string;

  @Expose()
  price: string;

  @Expose()
  duration: string;

  @Expose()
  makkahHotel: string;

  @Expose()
  madinahHotel: string;

  @Expose()
  image: string;

  @Expose()
  isActive: boolean;
}

export class MonthlyUmrahPackageResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  id: string;

  @Expose()
  month: string;

  @Expose()
  starCategory: number;

  @Expose()
  sectionTitle: string;

  @Expose()
  sectionSubtitle: string;

  @Expose()
  @Type(() => PackageItemResponseDto)
  packages: PackageItemResponseDto[];

  @Expose()
  features: string[];

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}