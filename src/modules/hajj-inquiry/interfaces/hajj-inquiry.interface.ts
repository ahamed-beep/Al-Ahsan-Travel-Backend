import { HajjInquiryStatus } from '../enums/hajj-inquiry.enum';

export interface IHajjInquiry {
  _id: string;
  fullName: string;
  phoneNumber: string;
  packageType?: string;
  hotelCategory?: string;
  departureDate?: string;
  departureAirport?: string;
  adults: number;
  children: number;
  status: HajjInquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHajjInquiryCreatePayload {
  fullName: string;
  phoneNumber: string;
  packageType?: string;
  hotelCategory?: string;
  departureDate?: string;
  departureAirport?: string;
  adults: number;
  children: number;
}