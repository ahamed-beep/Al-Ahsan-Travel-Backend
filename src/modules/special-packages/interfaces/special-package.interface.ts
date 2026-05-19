import { PackageCategory, StarRating, PackageBadge } from '../enums/special-package.enum';

export interface IHotelInfo {
  makkah: string;
  madinah: string;
}

export interface ISpecialPackage {
  category: PackageCategory;
  title: string;
  stars: StarRating;
  nights: number;
  price: string;
  originalPrice?: string;
  discount?: string;
  hotels: IHotelInfo;
  features: string[];
  image: string;
  badge?: PackageBadge;
  isPopular: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ISpecialPackageResponse = ISpecialPackage & {
  _id: string;
};

export interface IServiceResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
}