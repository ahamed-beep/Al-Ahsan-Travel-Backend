// dto/contact-response.dto.ts

import { Expose, Transform } from 'class-transformer';

export class ContactResponseDto {
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id?.toString())
  _id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  travelDate?: string;

  @Expose()
  message: string;

  @Expose()
  isRead: boolean;

  @Expose()
  isReplied: boolean;

  @Expose()
  repliedAt?: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}