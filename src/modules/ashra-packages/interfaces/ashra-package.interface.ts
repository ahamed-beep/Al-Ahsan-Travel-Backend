import { Document } from 'mongoose';
import { AshraCategoryEnum } from '../enums/ashra-category.enum';

export interface IAshraPackage extends Document {
  title: string;
  price: string;
  nights: number;
  stars: number;
  image: string;
  makkah: string;
  madinah: string;
  features: string[];
  badge: string | null;
  badgeBg: string | null;
  borderColor: string;
  category: AshraCategoryEnum;
  isPopular: boolean;
}