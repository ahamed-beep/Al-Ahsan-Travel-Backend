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
import { SpecialPackagesService } from './special-packages.service';
import { SpecialPackageResponseDto } from './dto/special-package-response.dto';
import {
  CreateSpecialPackageDto,
  UpdateSpecialPackageDto,
  FilterSpecialPackageDto,
} from './dto/special-package.dto';
import { PackageCategory } from './enums/special-package.enum';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { multerImageOptions } from 'src/shared/cloudinary/multer.config';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Controller('special-packages')
@SerializeResponse(SpecialPackageResponseDto)
export class SpecialPackagesController {
  private readonly logger = new Logger(SpecialPackagesController.name);

  constructor(
    private readonly specialPackagesService: SpecialPackagesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}


@Post()
@UseGuards(JwtAuthGuard)
@HttpCode(HttpStatus.CREATED)
@UseInterceptors(FileInterceptor('image', multerImageOptions))
async create(
  @Body() dto: CreateSpecialPackageDto,
  @UploadedFile() file?: Express.Multer.File,
) {
  try {

  console.log('isPopular raw:', dto.isPopular, typeof dto.isPopular);
console.log('isActive raw:', dto.isActive, typeof dto.isActive);
    // FormData sends hotels as a JSON string — parse it here
    if (typeof (dto as any).hotels === 'string') {
      try {
        (dto as any).hotels = JSON.parse((dto as any).hotels);
      } catch {
        throw new BadRequestException('Invalid hotels JSON format');
      }
    }

    if (file) {
      const uploaded = await this.cloudinaryService.uploadImageWebP(
        file.buffer,
        'special-packages',
      );
      dto.image = uploaded.secure_url;
    }
    return await this.specialPackagesService.create(dto);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    this.logger.error(`create failed: ${message}`);
    throw error;
  }
}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: FilterSpecialPackageDto) {
    try {
      return await this.specialPackagesService.findAll(filters);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`findAll failed: ${message}`);
      throw error;
    }
  }


  @Get('category/:category')
  @HttpCode(HttpStatus.OK)
  async findByCategory(@Param('category') category: PackageCategory) {
    try {
      return await this.specialPackagesService.findByCategory(category);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`findByCategory failed: ${message}`);
      throw error;
    }
  }


  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    try {
      return await this.specialPackagesService.findOne(id);
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
  @Body() dto: UpdateSpecialPackageDto,
  @UploadedFile() file?: Express.Multer.File,
) {
  try {
    
    // Same fix for update
    if (typeof (dto as any).hotels === 'string') {
      try {
        (dto as any).hotels = JSON.parse((dto as any).hotels);
      } catch {
        throw new BadRequestException('Invalid hotels JSON format');
      }
    }

    if (file) {
      const existing = await this.specialPackagesService.findOne(id);
      if (existing.data.image) {
        const publicId = this.cloudinaryService.extractPublicId(existing.data.image);
        await this.cloudinaryService.deleteImage(publicId);
      }
      const uploaded = await this.cloudinaryService.uploadImageWebP(
        file.buffer,
        'special-packages',
      );
      dto.image = uploaded.secure_url;
    }

    return await this.specialPackagesService.update(id, dto);
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
      return await this.specialPackagesService.toggleActive(id);
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
    return await this.specialPackagesService.togglePopular(id);
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
      // Delete image from Cloudinary before removing document
      const existing = await this.specialPackagesService.findOne(id);
      if (existing.data.image) {
        const publicId = this.cloudinaryService.extractPublicId(
          existing.data.image,
        );
        await this.cloudinaryService.deleteImage(publicId);
      }

      return await this.specialPackagesService.remove(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`remove failed for id=${id}: ${message}`);
      throw error;
    }
  }
}