// flight-deals.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FlightDealResponseDto } from './dto/flight-deal-response.dto';
import {
  CreateFlightDealDto,
  UpdateFlightDealDto,
  FilterFlightDealDto,
} from './dto/flight-deal.dto';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { multerImageOptions } from 'src/shared/cloudinary/multer.config';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { FlightDealsService } from './flight-deal.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('flight-deals')
@SerializeResponse(FlightDealResponseDto)
export class FlightDealsController {
  private readonly logger = new Logger(FlightDealsController.name);

  constructor(
    private readonly flightDealsService: FlightDealsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

@Post()
@UseGuards(JwtAuthGuard)
@HttpCode(HttpStatus.CREATED)
@UseInterceptors(FileInterceptor('image', multerImageOptions))
async create(
  @Body() dto: CreateFlightDealDto,
  @UploadedFile() file?: Express.Multer.File,
) {
  try {
    // Remove image field from dto if present (body se aaya ho toh)
    const { image, ...cleanDto } = dto as any;
    
    let imageUrl = '';
    
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    
    const uploaded = await this.cloudinaryService.uploadImageWebP(
      file.buffer,
      'flight-deals',
    );
    imageUrl = uploaded.secure_url;
    
    const createData = {
      ...cleanDto,
      image: imageUrl,
    };
    
    return await this.flightDealsService.create(createData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    this.logger.error(`create failed: ${message}`);
    throw error;
  }
}
  @Get()
   @Public()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: FilterFlightDealDto) {
    try {
      return await this.flightDealsService.findAll(filters);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`findAll failed: ${message}`);
      throw error;
    }
  }

  @Get(':id')
   @Public()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    try {
      return await this.flightDealsService.findOne(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`findOne failed for id=${id}: ${message}`);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFlightDealDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        const existing = await this.flightDealsService.findOne(id);
        if (existing.data.image) {
          const publicId = this.cloudinaryService.extractPublicId(existing.data.image);
          await this.cloudinaryService.deleteImage(publicId);
        }
        const uploaded = await this.cloudinaryService.uploadImageWebP(
          file.buffer,
          'flight-deals',
        );
        dto.image = uploaded.secure_url;
      }
      return await this.flightDealsService.update(id, dto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`update failed for id=${id}: ${message}`);
      throw error;
    }
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async toggleActive(@Param('id') id: string) {
    try {
      return await this.flightDealsService.toggleActive(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`toggleActive failed for id=${id}: ${message}`);
      throw error;
    }
  }

  @Patch(':id/toggle-popular')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async togglePopular(@Param('id') id: string) {
    try {
      return await this.flightDealsService.togglePopular(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`togglePopular failed for id=${id}: ${message}`);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      const existing = await this.flightDealsService.findOne(id);
      if (existing.data.image) {
        const publicId = this.cloudinaryService.extractPublicId(
          existing.data.image,
        );
        await this.cloudinaryService.deleteImage(publicId);
      }
      return await this.flightDealsService.remove(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`remove failed for id=${id}: ${message}`);
      throw error;
    }
  }
}