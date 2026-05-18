// pricing-package/pricing-package.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PackageCategory } from '../enums/package-category.enum';

export type PricingPackageDocument = PricingPackage & Document;

@Schema({ timestamps: true })
export class PricingPackage {
  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: null })
  badge: string | null;

  @Prop({ type: [String], required: true })
  features: string[];

  @Prop({
    type: String,
    enum: PackageCategory,
    required: true,
  })
  category: PackageCategory;
}

export const PricingPackageSchema = SchemaFactory.createForClass(PricingPackage);