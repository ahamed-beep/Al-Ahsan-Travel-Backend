import { Expose, Transform } from 'class-transformer';
import { NonShiftingHajjPackageStatus } from '../enums/non-shifting-hajj-package.enum';

export class NonShiftingHajjPackageDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  id: string;

  @Expose()
  title: string;

  @Expose()
  durationDays: number;

  @Expose()
  durationNights: number;

  @Expose()
  @Transform(({ obj }) => `${obj.durationDays} Days / ${obj.durationNights} Nights`)
  duration: string;

  @Expose()
  locations: string[];

  @Expose()
  tags: string[];

  @Expose()
  price: number;

  @Expose()
  currency: string;

  @Expose()
  perPersonText: string;

  @Expose()
  imageUrl: string;

  @Expose()
  popular: boolean;

  @Expose()
  status: NonShiftingHajjPackageStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}