import { Expose, Transform } from 'class-transformer';

export class GroupFamilyPackageResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  _id: string;

  @Expose()
  @Transform(({ obj }) => obj.title)
  title: string;

  @Expose()
  @Transform(({ obj }) => obj.duration)
  duration: string;

  @Expose()
  @Transform(({ obj }) => obj.makkahHotel)
  makkahHotel: string;

  @Expose()
  @Transform(({ obj }) => obj.madinahHotel)
  madinahHotel: string;

  @Expose()
  @Transform(({ obj }) => obj.price)
  price: string;

  @Expose()
  @Transform(({ obj }) => obj.hotelLabel)
  hotelLabel: string;

  @Expose()
  @Transform(({ obj }) => obj.starRating)
  starRating: number;

  @Expose()
  @Transform(({ obj }) => obj.category)
  category: string;

  @Expose()
  @Transform(({ obj }) => obj.popular)
  popular: boolean;

  @Expose()
  @Transform(({ obj }) => obj.isActive)
  isActive: boolean;

  @Expose()
  @Transform(({ obj }) => obj.includesFlight ?? false)
  includesFlight: boolean;

  @Expose()
  @Transform(({ obj }) => obj.includesVisa ?? false)
  includesVisa: boolean;

  @Expose()
  @Transform(({ obj }) => obj.includesTransport ?? false)
  includesTransport: boolean;

  @Expose()
  @Transform(({ obj }) => obj.includesGuide ?? false)
  includesGuide: boolean;

  @Expose()
  @Transform(({ obj }) => obj.imageUrl ?? null)
  imageUrl: string | null;

  @Expose()
  @Transform(({ obj }) => obj.createdAt)
  createdAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.updatedAt)
  updatedAt: Date;
}