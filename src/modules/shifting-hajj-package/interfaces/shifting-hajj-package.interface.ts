import { ShiftingHajjPackageStatus } from '../enums/shifting-hajj-package.enum';

export interface IShiftingHajjPackage {
  _id: string;
  title: string;
  durationDays: number;
  durationNights: number;
  locations: string[];
  tags: string[];
  price: number;
  currency: string;
  perPersonText: string;
  imageUrl: string;
  imagePublicId: string;
  popular: boolean;
  status: ShiftingHajjPackageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShiftingHajjPackageCreatePayload {
  title: string;
  durationDays: number;
  durationNights: number;
  locations: string[];
  tags: string[];
  price: number;
  currency?: string;
  perPersonText?: string;
  popular?: boolean;
  status?: ShiftingHajjPackageStatus;
  imageBuffer: Buffer;
  imageMimetype: string;
}

export interface IShiftingHajjPackageUpdatePayload {
  title?: string;
  durationDays?: number;
  durationNights?: number;
  locations?: string[];
  tags?: string[];
  price?: number;
  currency?: string;
  perPersonText?: string;
  popular?: boolean;
  status?: ShiftingHajjPackageStatus;
  imageBuffer?: Buffer;
  imageMimetype?: string;
}