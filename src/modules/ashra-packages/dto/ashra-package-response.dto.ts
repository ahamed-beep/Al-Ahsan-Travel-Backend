import { Expose, Transform } from 'class-transformer';
import { AshraCategoryEnum } from '../enums/ashra-category.enum';

export class AshraPackageResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  id: string;

  @Expose()
  title: string;

  @Expose()
  price: string;

  @Expose()
  nights: number;

  @Expose()
  stars: number;

  @Expose()
  image: string;

  @Expose()
  makkah: string;

  @Expose()
  madinah: string;

  @Expose()
  features: string[];

  @Expose()
  badge: string | null;

  @Expose()
  badgeBg: string | null;

  @Expose()
  borderColor: string;

  @Expose()
  category: AshraCategoryEnum;

  @Expose()
  isPopular: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}