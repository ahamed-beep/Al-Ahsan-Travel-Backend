import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UmrahPackageCategory, UmrahPackageStarRating } from '../enums/umrah-package.enum';

export type UmrahPackageDocument = UmrahPackageEntity & Document;

@Schema({ timestamps: true })
export class UmrahPackageEntity {
  @Prop({ required: true, maxlength: 150 })
  title: string;

  @Prop({ required: true, maxlength: 100 })
  duration: string;

  @Prop({ required: true, maxlength: 150 })
  makkahHotel: string;

  @Prop({ required: true, maxlength: 150 })
  madinahHotel: string;

  @Prop({ required: true, maxlength: 50 })
  price: string;

  @Prop({ default: null })
  imageUrl: string | null;

  @Prop({ default: null })
  imagePublicId: string | null;

  @Prop({ type: Number, enum: UmrahPackageStarRating, default: UmrahPackageStarRating.THREE })
  starRating: UmrahPackageStarRating;

  @Prop({ type: String, enum: UmrahPackageCategory, required: true })
  category: UmrahPackageCategory;

  @Prop({ default: true })
  includesFlight: boolean;

  @Prop({ default: true })
  includesVisa: boolean;

  @Prop({ default: true })
  includesTransport: boolean;

  @Prop({ default: false })
  includesGuide: boolean;

  @Prop({ default: false })
  isVip: boolean;

  @Prop({ default: false })
  isCustom: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const UmrahPackageSchema = SchemaFactory.createForClass(UmrahPackageEntity);