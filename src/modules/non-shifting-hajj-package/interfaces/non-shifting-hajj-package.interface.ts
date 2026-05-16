import { NonShiftingHajjPackageStatus } from '../enums/non-shifting-hajj-package.enum';

export interface INonShiftingHajjPackage {
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
  status: NonShiftingHajjPackageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface INonShiftingHajjPackageCreatePayload {
  title: string;
  durationDays: number;
  durationNights: number;
  locations: string[];
  tags: string[];
  price: number;
  currency?: string;
  perPersonText?: string;
  popular?: boolean;
  status?: NonShiftingHajjPackageStatus;
  imageBuffer: Buffer;
  imageMimetype: string;
}

export interface INonShiftingHajjPackageUpdatePayload {
  title?: string;
  durationDays?: number;
  durationNights?: number;
  locations?: string[];
  tags?: string[];
  price?: number;
  currency?: string;
  perPersonText?: string;
  popular?: boolean;
  status?: NonShiftingHajjPackageStatus;
  imageBuffer?: Buffer;
  imageMimetype?: string;
}