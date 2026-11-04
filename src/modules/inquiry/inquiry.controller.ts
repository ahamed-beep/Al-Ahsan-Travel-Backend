import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryDto, InquirySubmitResponseDto, SimpleInquiryResponseDto } from './dto/inquiry.dto';
import { InquiryType } from './enums/inquiry.enum';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ActiveUserGuard } from '../../common/guards/active-user.guard';
import { RequireRole } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';

@Controller('inquiry')
export class InquiryController {
  private readonly logger = new Logger(InquiryController.name);

  constructor(private readonly inquiryService: InquiryService) {}


  @Post('submit')
  @Public()
  @SerializeResponse(InquirySubmitResponseDto) 
  @HttpCode(HttpStatus.CREATED)
  async submit(@Body() createInquiryDto: CreateInquiryDto) {
    try {
      const inquiry = await this.inquiryService.submit(createInquiryDto);
      return {
        success: true,
        message: 'Your quote request has been submitted. We will contact you within 24 hours.',
        data: inquiry,
      };
    } catch (error: unknown) {
      this.logger.error('Submit Inquiry Error:', error);
      throw error;
    }
  }


  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('inquiryType') inquiryType?: string,
    @Query('search') search?: string,
  ) {
    try {
      if (
        inquiryType &&
        !Object.values(InquiryType).includes(inquiryType as InquiryType)
      ) {
        throw new BadRequestException(
          `inquiryType must be one of: ${Object.values(InquiryType).join(', ')}`,
        );
      }

      const { data, total } = await this.inquiryService.findAll(
        inquiryType as InquiryType | undefined,
        search?.trim().slice(0, 100),
      );
      return {
        success: true,
        total,
        data,
      };
    } catch (error: unknown) {
      this.logger.error('Get All Inquiries Error:', error);
      throw error;
    }
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(InquiryDto)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.inquiryService.findOne(id);
    } catch (error: unknown) {
      this.logger.error('Get Inquiry Error:', error);
      throw error;
    }
  }


  @Patch(':id/mark-read')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(InquiryDto)
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.inquiryService.markAsRead(id);
    } catch (error: unknown) {
      this.logger.error('Mark As Read Error:', error);
      throw error;
    }
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(SimpleInquiryResponseDto)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      await this.inquiryService.remove(id);
      return {
        success: true,
        message: 'Inquiry deleted successfully',
      };
    } catch (error: unknown) {
      this.logger.error('Delete Inquiry Error:', error);
      throw error;
    }
  }
}