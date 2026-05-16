import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { Inquiry, InquirySchema } from './entities/inquiry.schema';
import { MailModule } from 'src/shared/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Inquiry.name, schema: InquirySchema }]),
    MailModule,
  ],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}