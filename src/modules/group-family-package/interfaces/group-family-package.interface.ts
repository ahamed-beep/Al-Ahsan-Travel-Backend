import {
  GroupFamilyPackageCategory,
  GroupFamilyPackageStarRating,
} from '../enums/group-family-package.enum';

export interface IGroupFamilyPackage {
  _id: string;
  title: string;
  duration: string;
  makkahHotel: string;
  madinahHotel: string;
  price: string;
  hotelLabel: string;
  starRating: GroupFamilyPackageStarRating;
  category: GroupFamilyPackageCategory;
  popular: boolean;
  isActive: boolean;
  imageUrl: string | null;
  imagePublicId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroupFamilyPackageFilters {
  category?: GroupFamilyPackageCategory;
  starRating?: GroupFamilyPackageStarRating;
  popular?: boolean;
  isActive?: boolean;
}

export interface IGroupFamilyPackageImageUpload {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}