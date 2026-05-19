
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FlightDealDocument = FlightDeal & Document;

@Schema({ timestamps: true, collection: 'flight_deals' })
export class FlightDeal {
  @Prop({ required: true, trim: true })
  airline: string;

  @Prop({ required: true, trim: true })
  from: string;

  @Prop({ required: true, trim: true })
  to: string;

  @Prop({ required: true, trim: true })
  duration: string;

  @Prop({ required: true, trim: true })
  price: string;

  @Prop({ required: true, trim: true })
  image: string;

  @Prop({ trim: true })
  badge?: string;  

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>; 
}

export const FlightDealSchema = SchemaFactory.createForClass(FlightDeal);

FlightDealSchema.index({ from: 1, to: 1, isActive: 1 });
FlightDealSchema.index({ isPopular: 1, isActive: 1 });