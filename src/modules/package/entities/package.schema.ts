import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PackageStatus } from '../enums/package.enum';

export type PackageDocument = Package & Document;

@Schema({ timestamps: true })
export class Package {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 'GBP' })
  currency: string;

  @Prop({ required: true, min: 1 })
  durationDays: number;

  @Prop({ required: true, min: 1 })
  durationNights: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ trim: true })
  perPersonText?: string;

  @Prop({ enum: PackageStatus, default: PackageStatus.ACTIVE })
  status: PackageStatus;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  imagePublicId: string;

  @Prop({ trim: true })
  description?: string;
}

export const PackageSchema = SchemaFactory.createForClass(Package);