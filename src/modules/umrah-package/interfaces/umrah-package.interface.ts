import { UmrahPackageCategory, UmrahPackageStarRating } from '../enums/umrah-package.enum';

export interface IUmrahPackage {
  _id: string;
  title: string;
  duration: string;
  makkahHotel: string;
  madinahHotel: string;
  price: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  starRating: UmrahPackageStarRating;
  category: UmrahPackageCategory;
  includesFlight: boolean;
  includesVisa: boolean;
  includesTransport: boolean;
  includesGuide: boolean;
  isVip: boolean;
  isCustom: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUmrahPackageFilters {
  category?: UmrahPackageCategory;
  starRating?: UmrahPackageStarRating;
  includesFlight?: boolean;
  isActive?: boolean;
}

export interface IUmrahPackageImageUpload {
  fileBuffer: Buffer;
  folder: string;
  publicId?: string;
}