import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HajjInquiry, HajjInquiryDocument } from './entities/hajj-inquiry.schema';
import { CreateHajjInquiryDto } from './dto/create-hajj-inquiry.dto';
import { HajjInquiryStatus } from './enums/hajj-inquiry.enum';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/shared/mail/mail.service';
import { adminHajjInquiryTemplate } from './template/hajj-inquiry.templates';

@Injectable()
export class HajjInquiryService {
  private readonly logger = new Logger(HajjInquiryService.name);

  constructor(
    @InjectModel(HajjInquiry.name) private hajjInquiryModel: Model<HajjInquiryDocument>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async submit(dto: CreateHajjInquiryDto): Promise<HajjInquiry> {
    try {
      const inquiry = await this.hajjInquiryModel.create(dto);

      const adminEmail = this.configService.get<string>('SMTP_USER');
      await this.mailService.sendMail({
        to: adminEmail,
        subject: `New Hajj Quote Request — ${dto.fullName}`,
        html: adminHajjInquiryTemplate({
          fullName: dto.fullName,
          phoneNumber: dto.phoneNumber,
          packageType: dto.packageType,
          hotelCategory: dto.hotelCategory,
          departureDate: dto.departureDate,
          departureAirport: dto.departureAirport,
          adults: dto.adults,
          children: dto.children,
        }),
      });

      return inquiry;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Submit Hajj Inquiry Error: ${message}`);
      throw new InternalServerErrorException(`Failed to submit hajj inquiry: ${message}`);
    }
  }

  async findAll(): Promise<{ data: HajjInquiry[]; total: number }> {
    try {
      const [data, total] = await Promise.all([
        this.hajjInquiryModel.find().sort({ createdAt: -1 }),
        this.hajjInquiryModel.countDocuments(),
      ]);
      return { data, total };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Find All Hajj Inquiries Error: ${message}`);
      throw new InternalServerErrorException('Failed to fetch hajj inquiries');
    }
  }

  async findOne(id: string): Promise<HajjInquiry> {
    try {
      const inquiry = await this.hajjInquiryModel.findById(id);
      if (!inquiry) throw new NotFoundException('Hajj inquiry not found');
      return inquiry;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Find One Hajj Inquiry Error: ${message}`);
      throw new InternalServerErrorException('Failed to fetch hajj inquiry');
    }
  }

  async markAsRead(id: string): Promise<HajjInquiry> {
    try {
      const inquiry = await this.hajjInquiryModel.findByIdAndUpdate(
        id,
        { status: HajjInquiryStatus.READ },
        { new: true },
      );
      if (!inquiry) throw new NotFoundException('Hajj inquiry not found');
      return inquiry;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Mark As Read Hajj Inquiry Error: ${message}`);
      throw new InternalServerErrorException('Failed to update status');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const inquiry = await this.hajjInquiryModel.findByIdAndDelete(id);
      if (!inquiry) throw new NotFoundException('Hajj inquiry not found');
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Delete Hajj Inquiry Error: ${message}`);
      throw new InternalServerErrorException('Failed to delete hajj inquiry');
    }
  }
}