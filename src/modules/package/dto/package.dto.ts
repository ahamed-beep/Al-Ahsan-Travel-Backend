import { Expose, Transform } from 'class-transformer';
import { PackageStatus } from '../enums/package.enum';

export class PackageDto {
  @Expose()
  @Transform(({ obj }: { obj: { _id: { toString: () => string } } }) => obj._id?.toString())
  id: string;

  @Expose()
  title: string;

  @Expose()
  price: number;

  @Expose()
  currency: string;

  @Expose()
  durationDays: number;

  @Expose()
  durationNights: number;

  @Expose()
  @Transform(({ obj }: { obj: { durationDays: number; durationNights: number } }) =>
    `${obj.durationDays} Days / ${obj.durationNights} Nights`,
  )
  duration: string;

  @Expose()
  tags: string[];

  @Expose()
  perPersonText: string;

  @Expose()
  status: PackageStatus;

  @Expose()
  imageUrl: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}