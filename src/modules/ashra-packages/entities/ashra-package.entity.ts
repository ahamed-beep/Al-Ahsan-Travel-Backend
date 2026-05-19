import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AshraCategoryEnum } from '../enums/ashra-category.enum';

export type AshraPackageDocument = HydratedDocument<AshraPackage>;

@Schema({ timestamps: true })
export class AshraPackage {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  price: string;

  @Prop({ type: Number, required: true })
  nights: number;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  stars: number;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  makkah: string;

  @Prop({ type: String, required: true })
  madinah: string;

  @Prop({ type: [String], required: true })
  features: string[];

  @Prop({ type: String, default: null })
  badge: string | null;

  @Prop({ type: String, default: null })
  badgeBg: string | null;

  @Prop({ type: String, default: 'border-gray-200' })
  borderColor: string;

  @Prop({ type: String, enum: AshraCategoryEnum, required: true })
  category: AshraCategoryEnum;

  @Prop({ type: Boolean, default: false })
  isPopular: boolean;
}

export const AshraPackageSchema = SchemaFactory.createForClass(AshraPackage);