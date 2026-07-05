import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MonthlyUmrahPackagesService } from './monthly-umrah-package.service';
import { CreateMonthlyUmrahPackageDto } from './dto/create-monthly-umrah-package.dto';
import { UpdateMonthlyUmrahPackageDto } from './dto/update-monthly-umrah-package.dto';
import { MonthlyUmrahPackageResponseDto } from './dto/monthly-umrah-package-response.dto';
import { UmrahMonth, StarCategory } from './enums/umrah-month.enum';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { multerImageOptions } from 'src/shared/cloudinary/multer.config';

const MAX_PACKAGE_IMAGES = 20;

@Controller('monthly-umrah-packages')
export class MonthlyUmrahPackagesController {
  constructor(private readonly service: MonthlyUmrahPackagesService) {}

  @Get('month/:month')
  @Public()
  @SerializeResponse(MonthlyUmrahPackageResponseDto)
  async getByMonth(@Param('month') month: string) {
    try {
      return await this.service.findByMonth(month.toLowerCase() as UmrahMonth);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch packages for this month');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', MAX_PACKAGE_IMAGES, multerImageOptions))
  @SerializeResponse(MonthlyUmrahPackageResponseDto)
  async create(
    @Body() dto: CreateMonthlyUmrahPackageDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    try {
      return await this.service.create(dto, images);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to create package');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @SerializeResponse(MonthlyUmrahPackageResponseDto)
  async findAll(
    @Query('month') month?: UmrahMonth,
    @Query('starCategory') starCategory?: string,
    @Query('isActive') isActive?: string,
  ) {
    try {
      const query = {
        ...(month && { month }),
        ...(starCategory && { starCategory: Number(starCategory) as StarCategory }),
        ...(isActive !== undefined && { isActive: isActive === 'true' }),
      };
      return await this.service.findAll(query);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch packages');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @SerializeResponse(MonthlyUmrahPackageResponseDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.service.findOne(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch package');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @UseInterceptors(FilesInterceptor('images', MAX_PACKAGE_IMAGES, multerImageOptions))
  @SerializeResponse(MonthlyUmrahPackageResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMonthlyUmrahPackageDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    try {
      return await this.service.update(id, dto, images);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to update package');
    }
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @SerializeResponse(MonthlyUmrahPackageResponseDto)
  async toggleActive(@Param('id') id: string) {
    try {
      return await this.service.toggleActive(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to toggle package status');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      return await this.service.remove(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to delete package');
    }
  }
}