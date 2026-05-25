import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AshraPackagesService } from './ashra-packages.service';
import { CreateAshraPackageDto } from './dto/create-ashra-package.dto';
import { UpdateAshraPackageDto } from './dto/update-ashra-package.dto';
import { AshraCategoryEnum } from './enums/ashra-category.enum';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { multerImageOptions } from 'src/shared/cloudinary/multer.config';
import { AshraPackageResponseDto } from './dto/ashra-package-response.dto';

@Controller('ashra-packages')
export class AshraPackagesController {
  constructor(private readonly ashraPackagesService: AshraPackagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  @SerializeResponse(AshraPackageResponseDto)
  async create(
    @Body() dto: CreateAshraPackageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.ashraPackagesService.create(dto, file);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to create package');
    }
  }

  @Get('category/ashra_1')
  @Public()
  @SerializeResponse(AshraPackageResponseDto)
  async findAshra1() {
    try {
      return await this.ashraPackagesService.findByCategory(AshraCategoryEnum.ASHRA_1);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch Ashra 1 packages');
    }
  }

  @Get('category/ashra_2')
  @Public()
  @SerializeResponse(AshraPackageResponseDto)
  async findAshra2() {
    try {
      return await this.ashraPackagesService.findByCategory(AshraCategoryEnum.ASHRA_2);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch Ashra 2 packages');
    }
  }

  @Get('category/ashra_3')
  @Public()
  @SerializeResponse(AshraPackageResponseDto)
  async findAshra3() {
    try {
      return await this.ashraPackagesService.findByCategory(AshraCategoryEnum.ASHRA_3);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch Ashra 3 packages');
    }
  }

  @Get(':id')
     @Public()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @SerializeResponse(AshraPackageResponseDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.ashraPackagesService.findOne(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch package');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  @SerializeResponse(AshraPackageResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAshraPackageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.ashraPackagesService.update(id, dto, file);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to update package');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      return await this.ashraPackagesService.remove(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to delete package');
    }
  }
}