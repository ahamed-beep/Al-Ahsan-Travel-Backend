// dto/flight-deal-response.dto.ts

import { Expose, Transform } from 'class-transformer';

export class FlightDealResponseDto {
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id?.toString())
  _id: string;

  @Expose()
  airline: string;

  @Expose()
  from: string;

  @Expose()
  to: string;

  @Expose()
  duration: string;

  @Expose()
  price: string;

  @Expose()
  image: string;

  @Expose()
  badge?: string;

  @Expose()
  isPopular: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}