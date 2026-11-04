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
import { HajjInquiryService } from './hajj-inquiry.service';
import { CreateHajjInquiryDto } from './dto/create-hajj-inquiry.dto';
import {
  HajjInquiryDto,
  HajjInquirySubmitResponseDto,
  SimpleHajjInquiryResponseDto,
} from './dto/hajj-inquiry.dto';
import { HajjInquiryType } from './enums/hajj-inquiry.enum';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ActiveUserGuard } from '../../common/guards/active-user.guard';
import { RequireRole } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';

@Controller('hajj-inquiry')
export class HajjInquiryController {
  private readonly logger = new Logger(HajjInquiryController.name);

  constructor(private readonly hajjInquiryService: HajjInquiryService) {}


  @Post('submit')
  @Public()
  @SerializeResponse(HajjInquirySubmitResponseDto)
  @HttpCode(HttpStatus.CREATED)
  async submit(@Body() dto: CreateHajjInquiryDto) {
    try {
      const inquiry = await this.hajjInquiryService.submit(dto);
      return {
        success: true,
        message: 'Your Hajj quote request has been submitted. We will contact you within 24 hours.',
        data: inquiry,
      };
    } catch (error: unknown) {
      this.logger.error('Submit Hajj Inquiry Error:', error);
      throw error;
    }
  }


  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
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
        !Object.values(HajjInquiryType).includes(inquiryType as HajjInquiryType)
      ) {
        throw new BadRequestException(
          `inquiryType must be one of: ${Object.values(HajjInquiryType).join(', ')}`,
        );
      }

      const { data, total } = await this.hajjInquiryService.findAll(
        inquiryType as HajjInquiryType | undefined,
        search?.trim().slice(0, 100),
      );
      return {
        success: true,
        total,
        data,
      };
    } catch (error: unknown) {
      this.logger.error('Get All Hajj Inquiries Error:', error);
      throw error;
    }
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(HajjInquiryDto)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.hajjInquiryService.findOne(id);
    } catch (error: unknown) {
      this.logger.error('Get Hajj Inquiry Error:', error);
      throw error;
    }
  }


  @Patch(':id/mark-read')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(HajjInquiryDto)
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.hajjInquiryService.markAsRead(id);
    } catch (error: unknown) {
      this.logger.error('Mark As Read Hajj Inquiry Error:', error);
      throw error;
    }
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(SimpleHajjInquiryResponseDto)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      await this.hajjInquiryService.remove(id);
      return {
        success: true,
        message: 'Hajj inquiry deleted successfully',
      };
    } catch (error: unknown) {
      this.logger.error('Delete Hajj Inquiry Error:', error);
      throw error;
    }
  }
}