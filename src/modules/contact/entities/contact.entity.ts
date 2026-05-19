// entities/contact.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true, collection: 'contact_inquiries' })
export class Contact {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  travelDate?: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isReplied: boolean;

  @Prop({ type: Date, default: null })
  repliedAt?: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

// Add indexes for better query performance
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ isRead: 1 });
ContactSchema.index({ email: 1 });