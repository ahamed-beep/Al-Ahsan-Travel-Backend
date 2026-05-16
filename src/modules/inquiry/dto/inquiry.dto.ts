import { Expose, Transform, Type } from 'class-transformer';
import { InquiryStatus } from '../enums/inquiry.enum';

export class InquiryDto {
  @Expose()
  @Transform(({ obj }: { obj: { _id: { toString: () => string } } }) => obj._id?.toString())
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  phone: string;

  @Expose()
  departureDate: string;

  @Expose()
  departureAirport: string;

  @Expose()
  adults: number;

  @Expose()
  children: number;

  @Expose()
  status: InquiryStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class InquirySubmitResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  @Type(() => InquiryDto)
  data: InquiryDto;
}

export class SimpleInquiryResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;
}