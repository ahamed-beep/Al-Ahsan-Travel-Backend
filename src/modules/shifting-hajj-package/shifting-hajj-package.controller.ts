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
import { ShiftingHajjPackageService } from './shifting-hajj-package.service';
import { CreateShiftingHajjPackageDto } from './dto/create-shifting-hajj-package.dto';
import { UpdateShiftingHajjPackageDto } from './dto/update-shifting-hajj-package.dto';
import { ShiftingHajjPackageDto } from './dto/shifting-hajj-package.dto';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import { multerImageOptions } from '../../shared/cloudinary/multer.config';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ActiveUserGuard } from '../../common/guards/active-user.guard';
import { RequireRole } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';

@Controller('shifting-hajj-packages')
export class ShiftingHajjPackageController {
  private readonly logger = new Logger(ShiftingHajjPackageController.name);

  constructor(private readonly service: ShiftingHajjPackageService) {}

  // ─── Public ───────────────────────────────────────────────────────────────

  @Get()
  @Public()
  @SerializeResponse(ShiftingHajjPackageDto)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      return await this.service.findAll();
    } catch (error: unknown) {
      this.logger.error('Get All Error:', error);
      throw error;
    }
  }

  @Get(':id')
  @Public()
  @SerializeResponse(ShiftingHajjPackageDto)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.service.findOne(id);
    } catch (error: unknown) {
      this.logger.error('Get One Error:', error);
      throw error;
    }
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(ShiftingHajjPackageDto)
  @HttpCode(HttpStatus.OK)
  async findAllAdmin() {
    try {
      return await this.service.findAllAdmin();
    } catch (error: unknown) {
      this.logger.error('Admin Get All Error:', error);
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(ShiftingHajjPackageDto)
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateShiftingHajjPackageDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    try {
      return await this.service.create(dto, imageFile);
    } catch (error: unknown) {
      this.logger.error('Create Error:', error);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @SerializeResponse(ShiftingHajjPackageDto)
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateShiftingHajjPackageDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    try {
      return await this.service.update(id, dto, imageFile);
    } catch (error: unknown) {
      this.logger.error('Update Error:', error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.service.remove(id);
    } catch (error: unknown) {
      this.logger.error('Delete Error:', error);
      throw error;
    }
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.service.toggleStatus(id);
    } catch (error: unknown) {
      this.logger.error('Toggle Status Error:', error);
      throw error;
    }
  }

  @Patch(':id/toggle-popular')
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  async togglePopular(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return await this.service.togglePopular(id);
    } catch (error: unknown) {
      this.logger.error('Toggle Popular Error:', error);
      throw error;
    }
  }
}