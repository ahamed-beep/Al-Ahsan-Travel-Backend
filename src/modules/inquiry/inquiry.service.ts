import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InquiryStatus } from './enums/inquiry.enum';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/shared/mail/mail.service';
import { Inquiry, InquiryDocument } from './entities/inquiry.schema';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { adminInquiryTemplate } from './templates/inquiry.templates';

@Injectable()
export class InquiryService {
  private readonly logger = new Logger(InquiryService.name);

  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async submit(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    try {
      const inquiry = await this.inquiryModel.create(createInquiryDto);

      const adminEmail = this.configService.get<string>('SMTP_USER');
      await this.mailService.sendMail({
        to: adminEmail,
        subject: `New Quote Request — ${createInquiryDto.fullName}`,
        html: adminInquiryTemplate({
          fullName: createInquiryDto.fullName,
          phone: createInquiryDto.phone,
          departureDate: createInquiryDto.departureDate,
          departureAirport: createInquiryDto.departureAirport,
          adults: createInquiryDto.adults,
          children: createInquiryDto.children,
        }),
      });

      return inquiry;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Submit Inquiry Error: ${message}`);
      throw new InternalServerErrorException(`Failed to submit inquiry: ${message}`);
    }
  }

  async findAll(): Promise<{ data: Inquiry[]; total: number }> {
    try {
      const [data, total] = await Promise.all([
        this.inquiryModel.find().sort({ createdAt: -1 }),
        this.inquiryModel.countDocuments(),
      ]);
      return { data, total };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Find All Inquiries Error: ${message}`);
      throw new InternalServerErrorException('Failed to fetch inquiries');
    }
  }

  async findOne(id: string): Promise<Inquiry> {
    try {
      const inquiry = await this.inquiryModel.findById(id);
      if (!inquiry) throw new NotFoundException('Inquiry not found');
      return inquiry;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Find One Inquiry Error: ${message}`);
      throw new InternalServerErrorException('Failed to fetch inquiry');
    }
  }

  async markAsRead(id: string): Promise<Inquiry> {
    try {
      const inquiry = await this.inquiryModel.findByIdAndUpdate(
        id,
        { status: InquiryStatus.READ },
        { new: true },
      );
      if (!inquiry) throw new NotFoundException('Inquiry not found');
      return inquiry;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Mark As Read Error: ${message}`);
      throw new InternalServerErrorException('Failed to update inquiry status');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const inquiry = await this.inquiryModel.findByIdAndDelete(id);
      if (!inquiry) throw new NotFoundException('Inquiry not found');
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Delete Inquiry Error: ${message}`);
      throw new InternalServerErrorException('Failed to delete inquiry');
    }
  }
}