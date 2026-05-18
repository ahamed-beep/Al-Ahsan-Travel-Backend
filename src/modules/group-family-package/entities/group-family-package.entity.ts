import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  GroupFamilyPackageCategory,
  GroupFamilyPackageStarRating,
} from '../enums/group-family-package.enum';

export type GroupFamilyPackageDocument = GroupFamilyPackageEntity & Document;

@Schema({ timestamps: true, collection: 'group_family_packages' })
export class GroupFamilyPackageEntity {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  duration: string;

  @Prop({ required: true, trim: true })
  makkahHotel: string;

  @Prop({ required: true, trim: true })
  madinahHotel: string;

  @Prop({ required: true, trim: true })
  price: string;

  @Prop({ required: true, trim: true })
  hotelLabel: string;

  @Prop({ required: true, enum: GroupFamilyPackageStarRating, type: Number })
  starRating: GroupFamilyPackageStarRating;

  @Prop({ required: true, enum: GroupFamilyPackageCategory })
  category: GroupFamilyPackageCategory;

  @Prop({ default: false })
  popular: boolean;

  @Prop({ default: true })
  isActive: boolean;

  // ── Feature flags ──────────────────────────────────────────────
  @Prop({ default: false })
  includesFlight: boolean;

  @Prop({ default: false })
  includesVisa: boolean;

  @Prop({ default: false })
  includesTransport: boolean;

  @Prop({ default: false })
  includesGuide: boolean;

  @Prop({ default: null })
  imageUrl: string | null;

  @Prop({ default: null })
  imagePublicId: string | null;
}

export const GroupFamilyPackageSchema = SchemaFactory.createForClass(
  GroupFamilyPackageEntity,
);