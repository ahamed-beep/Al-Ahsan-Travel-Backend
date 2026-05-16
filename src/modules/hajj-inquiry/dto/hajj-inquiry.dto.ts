import { Expose, Transform, Type } from 'class-transformer';
import { HajjInquiryStatus } from '../enums/hajj-inquiry.enum';

export class HajjInquiryDto {
  @Expose()
  @Transform(({ obj }: { obj: { _id: { toString: () => string } } }) => obj._id?.toString())
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  packageType: string;

  @Expose()
  hotelCategory: string;

  @Expose()
  departureDate: string;

  @Expose()
  departureAirport: string;

  @Expose()
  adults: number;

  @Expose()
  children: number;

  @Expose()
  status: HajjInquiryStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class HajjInquirySubmitResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  @Type(() => HajjInquiryDto)
  data: HajjInquiryDto;
}

export class SimpleHajjInquiryResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;
}