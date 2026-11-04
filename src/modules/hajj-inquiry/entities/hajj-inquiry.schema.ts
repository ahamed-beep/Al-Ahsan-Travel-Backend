import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HajjInquiryStatus, HajjInquiryType } from '../enums/hajj-inquiry.enum';

export type HajjInquiryDocument = HajjInquiry & Document;

@Schema({ timestamps: true })
export class HajjInquiry {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true })
  phoneNumber: string;

  @Prop({ trim: true })
  packageType?: string;

  @Prop({ trim: true })
  hotelCategory?: string;

  @Prop({ trim: true })
  departureDate?: string;

  @Prop({ trim: true })
  departureAirport?: string;

  @Prop({ enum: HajjInquiryType, default: HajjInquiryType.HAJJ, index: true })
  inquiryType: HajjInquiryType;

  @Prop({ required: true, min: 1 })
  adults: number;

  @Prop({ required: true, min: 0, default: 0 })
  children: number;

  @Prop({ enum: HajjInquiryStatus, default: HajjInquiryStatus.NEW })
  status: HajjInquiryStatus;
}

export const HajjInquirySchema = SchemaFactory.createForClass(HajjInquiry);