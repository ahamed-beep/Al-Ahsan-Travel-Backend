import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HajjInquiryService } from './hajj-inquiry.service';
import { HajjInquiryController } from './hajj-inquiry.controller';
import { HajjInquiry, HajjInquirySchema } from './entities/hajj-inquiry.schema';
import { MailModule } from 'src/shared/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HajjInquiry.name, schema: HajjInquirySchema }]),
    MailModule,
  ],
  controllers: [HajjInquiryController],
  providers: [HajjInquiryService],
})
export class HajjInquiryModule {}