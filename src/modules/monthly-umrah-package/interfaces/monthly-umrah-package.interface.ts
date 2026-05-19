import { UmrahMonth, StarCategory } from '../enums/umrah-month.enum';

export interface IPackageItem {
  title: string;
  price: string;
  duration: string;
  makkahHotel: string;
  madinahHotel: string;
   image: string;  
  isActive: boolean;
}

export interface IMonthlyUmrahPackage {
  month: UmrahMonth;
  starCategory: StarCategory;
  sectionTitle: string;
  sectionSubtitle: string;
  packages: IPackageItem[];
  features: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPackageQuery {
  month?: UmrahMonth;
  starCategory?: StarCategory;
  isActive?: boolean;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}