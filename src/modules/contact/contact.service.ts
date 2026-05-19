// contact.service.ts

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact, ContactDocument } from './entities/contact.entity';
import {
  CreateContactDto,
  UpdateContactDto,
  FilterContactDto,
} from './dto/contact.dto';
import {
  IServiceResponse,
  IPaginatedResponse,
  IContactResponse,
} from './interfaces/contact.interface';
import {
  getUserConfirmationEmail,
  getAdminNotificationEmail,
} from './templates/email-templates';
import { MailService } from 'src/shared/mail/mail.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
    private readonly mailService: MailService,
  ) {}

  async create(
    dto: CreateContactDto,
  ): Promise<IServiceResponse<IContactResponse>> {
    try {
      // Save to database
      const created = await this.contactModel.create({
        ...dto,
        isRead: false,
        isReplied: false,
      });

      // Send email to user
      await this.mailService.sendMail({
        to: dto.email,
        subject: '🕋 Umrah Inquiry Received - Al-Ahsan Travels',
        html: getUserConfirmationEmail(dto.fullName),
      });

      // Send email to admin
      await this.mailService.sendMail({
        to: 'muhamedahad251@gmail.com', // Admin email
        subject: '🔔 New Umrah Inquiry - Action Required',
        html: getAdminNotificationEmail({
          fullName: dto.fullName,
          email: dto.email,
          phone: dto.phone,
          travelDate: dto.travelDate,
          message: dto.message,
        }),
      });

      return {
        success: true,
        message: 'Inquiry submitted successfully. Check your email for confirmation.',
        data: created.toObject() as unknown as IContactResponse,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to submit inquiry: ${message}`,
      );
    }
  }

  async findAll(
    filters: FilterContactDto,
  ): Promise<IPaginatedResponse<IContactResponse>> {
    try {
      const { isRead, isReplied, page = 1, limit = 10 } = filters;
      const query: Record<string, unknown> = {};

      if (isRead !== undefined) query.isRead = isRead;
      if (isReplied !== undefined) query.isReplied = isReplied;

      const skip = (page - 1) * limit;

      const [inquiries, total] = await Promise.all([
        this.contactModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean()
          .exec(),
        this.contactModel.countDocuments(query).exec(),
      ]);

      return {
        success: true,
        message: 'Inquiries fetched successfully',
        data: inquiries as unknown as IContactResponse[],
        total,
        page,
        limit,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to fetch inquiries: ${message}`,
      );
    }
  }

  async findOne(
    id: string,
  ): Promise<IServiceResponse<IContactResponse>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid inquiry ID: ${id}`);
      }

      const inquiry = await this.contactModel.findById(id).lean().exec();

      if (!inquiry) {
        throw new NotFoundException(`Inquiry with ID '${id}' not found`);
      }

      return {
        success: true,
        message: 'Inquiry fetched successfully',
        data: inquiry as unknown as IContactResponse,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to fetch inquiry: ${message}`,
      );
    }
  }

  async update(
    id: string,
    dto: UpdateContactDto,
  ): Promise<IServiceResponse<IContactResponse>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid inquiry ID: ${id}`);
      }

      const updated = await this.contactModel
        .findByIdAndUpdate(
          id,
          { $set: { ...dto } },
          { new: true, runValidators: true },
        )
        .lean()
        .exec();

      if (!updated) {
        throw new NotFoundException(`Inquiry with ID '${id}' not found`);
      }

      return {
        success: true,
        message: 'Inquiry updated successfully',
        data: updated as unknown as IContactResponse,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to update inquiry: ${message}`,
      );
    }
  }

  async markAsRead(id: string): Promise<IServiceResponse<IContactResponse>> {
    return this.update(id, { isRead: true });
  }

  async markAsReplied(id: string): Promise<IServiceResponse<IContactResponse>> {
    return this.update(id, { isReplied: true, repliedAt: new Date() });
  }

  async remove(id: string): Promise<IServiceResponse<null>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid inquiry ID: ${id}`);
      }

      const deleted = await this.contactModel
        .findByIdAndDelete(id)
        .lean()
        .exec();

      if (!deleted) {
        throw new NotFoundException(`Inquiry with ID '${id}' not found`);
      }

      return {
        success: true,
        message: 'Inquiry deleted successfully',
        data: null,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to delete inquiry: ${message}`,
      );
    }
  }

  async getStats(): Promise<IServiceResponse<any>> {
    try {
      const [total, unread, replied, today] = await Promise.all([
        this.contactModel.countDocuments(),
        this.contactModel.countDocuments({ isRead: false }),
        this.contactModel.countDocuments({ isReplied: true }),
        this.contactModel.countDocuments({
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }),
      ]);

      return {
        success: true,
        message: 'Stats fetched successfully',
        data: { total, unread, replied, today },
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch stats');
    }
  }
}