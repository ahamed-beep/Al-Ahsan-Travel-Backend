import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NonShiftingHajjPackageStatus, NonShiftingHajjPackageTag } from '../enums/non-shifting-hajj-package.enum';

export type NonShiftingHajjPackageDocument = NonShiftingHajjPackage & Document;

@Schema({ timestamps: true })
export class NonShiftingHajjPackage {
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
    enum: Object.values(NonShiftingHajjPackageTag),
    default: [],
  })
  tags: NonShiftingHajjPackageTag[];

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
    enum: NonShiftingHajjPackageStatus,
    default: NonShiftingHajjPackageStatus.ACTIVE,
  })
  status: NonShiftingHajjPackageStatus;
}

export const NonShiftingHajjPackageSchema =
  SchemaFactory.createForClass(NonShiftingHajjPackage);