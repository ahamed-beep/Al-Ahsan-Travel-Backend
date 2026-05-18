// pricing-package/interfaces/pricing-package.interface.ts
import { Types } from 'mongoose';
import { PackageCategory } from '../enums/package-category.enum';

export interface IPricingPackage {
  _id?: Types.ObjectId;
  duration: string;
  title: string;
  price: string;
  featured: boolean;
  badge?: string | null;
  features: string[];
  category: PackageCategory;
}