import { PackageStatus } from '../enums/package.enum';

export interface IPackage {
  _id: string;
  title: string;
  price: number;
  currency: string;
  durationDays: number;
  durationNights: number;
  tags: string[];
  perPersonText?: string;
  status: PackageStatus;
  imageUrl: string;
  imagePublicId: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPackageCreatePayload {
  title: string;
  price: number;
  currency?: string;
  durationDays: number;
  durationNights: number;
  tags?: string[];
  perPersonText?: string;
  status?: PackageStatus;
  description?: string;
  imageBuffer: Buffer;
}

export interface IPackageUpdatePayload {
  title?: string;
  price?: number;
  currency?: string;
  durationDays?: number;
  durationNights?: number;
  tags?: string[];
  perPersonText?: string;
  status?: PackageStatus;
  description?: string;
  imageBuffer?: Buffer;
}