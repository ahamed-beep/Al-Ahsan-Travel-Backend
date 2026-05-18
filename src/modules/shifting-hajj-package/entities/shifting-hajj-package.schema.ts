import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ShiftingHajjPackageStatus, ShiftingHajjPackageTag } from '../enums/shifting-hajj-package.enum';

export type ShiftingHajjPackageDocument = ShiftingHajjPackage & Document;

@Schema({ timestamps: true })
export class ShiftingHajjPackage {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, min: 1 })
  durationDays: number;

  @Prop({ required: true, min: 1 })
  durationNights: number;

  @Prop({ type: [String], default: [] })
  locations: string[];

  @Prop({
    type: [String],
    enum: Object.values(ShiftingHajjPackageTag),
    default: [],
  })
  tags: ShiftingHajjPackageTag[];

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 'GBP' })
  currency: string;

  @Prop({ default: 'per person' })
  perPersonText: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  imagePublicId: string;

  @Prop({ default: false })
  popular: boolean;

  @Prop({
    enum: ShiftingHajjPackageStatus,
    default: ShiftingHajjPackageStatus.ACTIVE,
  })
  status: ShiftingHajjPackageStatus;
}

export const ShiftingHajjPackageSchema =
  SchemaFactory.createForClass(ShiftingHajjPackage);