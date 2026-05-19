import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UmrahMonth, StarCategory } from '../enums/umrah-month.enum';
import { IPackageItem, IMonthlyUmrahPackage } from '../interfaces/monthly-umrah-package.interface';

export type MonthlyUmrahPackageDocument = MonthlyUmrahPackage & Document;

@Schema({ _id: false })
export class PackageItem implements IPackageItem {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  price: string;

  @Prop({ required: true, trim: true })
  duration: string;

  @Prop({ required: true, trim: true })
  makkahHotel: string;

  @Prop({ required: true, trim: true })
  madinahHotel: string;

  @Prop({ default: '', trim: true })
  image: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const PackageItemSchema = SchemaFactory.createForClass(PackageItem);

@Schema({ timestamps: true, collection: 'monthly_umrah_packages' })
export class MonthlyUmrahPackage implements IMonthlyUmrahPackage {
  @Prop({
    required: true,
    enum: Object.values(UmrahMonth),
    type: String,
    lowercase: true,
  })
  month: UmrahMonth;

  @Prop({
    required: true,
    enum: Object.values(StarCategory).filter((v) => typeof v === 'number'),
    type: Number,
  })
  starCategory: StarCategory;

  @Prop({ required: true, trim: true })
  sectionTitle: string;

  @Prop({ required: true, trim: true })
  sectionSubtitle: string;

  @Prop({ type: [PackageItemSchema], default: [] })
  packages: PackageItem[];

  @Prop({ type: [String], default: ['Flights', 'Visa', 'Transport', 'Hotels'] })
  features: string[];

  @Prop({ default: '', trim: true })
  whatsappNumber: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const MonthlyUmrahPackageSchema = SchemaFactory.createForClass(MonthlyUmrahPackage);

MonthlyUmrahPackageSchema.index({ month: 1, starCategory: 1 }, { unique: true });