import { InquiryStatus, InquiryType } from '../enums/inquiry.enum';

export interface IInquiry {
  _id: string;
  fullName: string;
  phone: string;
  departureDate?: string;
  departureAirport?: string;
  inquiryType: InquiryType;
  packageTier?: string;
  adults: number;
  children: number;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInquiryCreatePayload {
  fullName: string;
  phone: string;
  departureDate?: string;
  departureAirport?: string;
  inquiryType: InquiryType;
  packageTier?: string;
  adults: number;
  children: number;
}