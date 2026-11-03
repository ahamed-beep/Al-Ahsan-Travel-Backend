import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { InquiryStatus, InquiryType } from '../enums/inquiry.enum';

export type InquiryDocument = Inquiry & Document;

@Schema({ timestamps: true })
export class Inquiry {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  departureDate?: string;

  @Prop({ trim: true })
  departureAirport?: string;

  @Prop({ enum: InquiryType, default: InquiryType.UMRAH, index: true })
  inquiryType: InquiryType;

  @Prop({ trim: true })
  packageTier?: string;

  @Prop({ required: true, min: 1 })
  adults: number;

  @Prop({ required: true, min: 0, default: 0 })
  children: number;

  @Prop({ enum: InquiryStatus, default: InquiryStatus.NEW })
  status: InquiryStatus;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);