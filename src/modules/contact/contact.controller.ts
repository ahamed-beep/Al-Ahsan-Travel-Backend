// contact.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactResponseDto } from './dto/contact-response.dto';
import {
  CreateContactDto,
  UpdateContactDto,
  FilterContactDto,
} from './dto/contact.dto';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('contact')
@SerializeResponse(ContactResponseDto)
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}

  @Post()
   @Public()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateContactDto) {
    try {
      return await this.contactService.create(dto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`create failed: ${message}`);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: FilterContactDto) {
    try {
      return await this.contactService.findAll(filters);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`findAll failed: ${message}`);
      throw error;
    }
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getStats() {
    try {
      return await this.contactService.getStats();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`getStats failed: ${message}`);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    try {
      return await this.contactService.findOne(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`findOne failed for id=${id}: ${message}`);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    try {
      return await this.contactService.update(id, dto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`update failed for id=${id}: ${message}`);
      throw error;
    }
  }

  @Patch(':id/mark-read')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id') id: string) {
    try {
      return await this.contactService.markAsRead(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`markAsRead failed for id=${id}: ${message}`);
      throw error;
    }
  }

  @Patch(':id/mark-replied')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async markAsReplied(@Param('id') id: string) {
    try {
      return await this.contactService.markAsReplied(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`markAsReplied failed for id=${id}: ${message}`);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      return await this.contactService.remove(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`remove failed for id=${id}: ${message}`);
      throw error;
    }
  }
}