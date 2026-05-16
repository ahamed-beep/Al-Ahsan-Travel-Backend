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
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageDto } from './dto/package.dto';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import { multerImageOptions } from '../../shared/cloudinary/multer.config';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ActiveUserGuard } from '../../common/guards/active-user.guard';
import { RequireRole } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';

@Controller('packages')
export class PackageController {
  private readonly logger = new Logger(PackageController.name);

  constructor(private readonly packageService: PackageService) {}


  @Get()
  @Public()
  @SerializeResponse(PackageDto)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      return await this.packageService.findAll();
    } catch (error: unknown) {
      this.logger.error('Get All Packages Error:', error);
      throw error;
    }
  }

  @Get(':id')
  @Public()
  @SerializeResponse(PackageDto)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.packageService.findOne(id);
    } catch (error: unknown) {
      this.logger.error('Get Package Error:', error);
      throw error;
    }
  }


  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(PackageDto)
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPackageDto: CreatePackageDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    try {
      return await this.packageService.create(createPackageDto, imageFile);
    } catch (error: unknown) {
      this.logger.error('Create Package Error:', error);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(PackageDto)
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updatePackageDto: UpdatePackageDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    try {
      return await this.packageService.update(id, updatePackageDto, imageFile);
    } catch (error: unknown) {
      this.logger.error('Update Package Error:', error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.packageService.remove(id);
    } catch (error: unknown) {
      this.logger.error('Delete Package Error:', error);
      throw error;
    }
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.packageService.toggleStatus(id);
    } catch (error: unknown) {
      this.logger.error('Toggle Package Status Error:', error);
      throw error;
    }
  }
}