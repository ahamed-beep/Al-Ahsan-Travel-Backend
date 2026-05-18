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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';
import { Public } from 'src/common/decorators/public.decorator';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { UmrahPackageResponseDto } from './dto/umrah-package-response.dto';
import { UmrahPackagesService } from './umrah-package.service';
import { multerImageOptions } from 'src/shared/cloudinary/multer.config';
import { CreateUmrahPackageDto } from './dto/create-umrah-package.dto';
import { UmrahPackageFilterDto } from './dto/umrah-package-filter.dto';
import { UpdateUmrahPackageDto } from './dto/update-umrah-package.dto';

@Controller('umrah-packages')
@SerializeResponse(UmrahPackageResponseDto)
export class UmrahPackagesController {
  constructor(private readonly umrahPackagesService: UmrahPackagesService) {}

  @Post()
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  async create(
    @Body() createUmrahPackageDto: CreateUmrahPackageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.umrahPackagesService.create(createUmrahPackageDto, file);
  }

  @Get()
  @Public()
  async findAll(@Query() filters: UmrahPackageFilterDto) {
    return this.umrahPackagesService.findAll(filters);
  }

  @Get('category/:category')
  @Public()
  async findByCategory(@Param('category') category: string) {
    return this.umrahPackagesService.findByCategory(category);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.umrahPackagesService.findOne(id);
  }

  @Patch(':id')
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  async update(
    @Param('id') id: string,
    @Body() updateUmrahPackageDto: UpdateUmrahPackageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.umrahPackagesService.update(id, updateUmrahPackageDto, file);
  }

  @Delete(':id')
  @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.umrahPackagesService.remove(id);
  }
}