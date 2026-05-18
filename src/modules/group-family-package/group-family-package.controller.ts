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
import { multerImageOptions } from 'src/shared/cloudinary/multer.config';
import { GroupFamilyPackageResponseDto } from './dto/group-family-package-response.dto';
import { CreateGroupFamilyPackageDto } from './dto/create-group-family-package.dto';
import { UpdateGroupFamilyPackageDto } from './dto/update-group-family-package.dto';
import { GroupFamilyPackageFilterDto } from './dto/group-family-package-filter.dto';
import { GroupFamilyPackageCategory } from './enums/group-family-package.enum';
import { GroupFamilyPackagesService } from './group-family-package.service';

@Controller('group-family-packages')
@SerializeResponse(GroupFamilyPackageResponseDto)
export class GroupFamilyPackagesController {
  constructor(
    private readonly groupFamilyPackagesService: GroupFamilyPackagesService,
  ) {}

  @Post()
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  async create(
    @Body() createDto: CreateGroupFamilyPackageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.groupFamilyPackagesService.create(createDto, file);
  }

  @Get()
  @Public()
  async findAll(@Query() filters: GroupFamilyPackageFilterDto) {
    return this.groupFamilyPackagesService.findAll(filters);
  }

  @Get('category/:category')
  @Public()
  async findByCategory(
    @Param('category') category: GroupFamilyPackageCategory,
  ) {
    return this.groupFamilyPackagesService.findByCategory(category);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.groupFamilyPackagesService.findOne(id);
  }

  @Patch(':id')
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateGroupFamilyPackageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.groupFamilyPackagesService.update(id, updateDto, file);
  }

  @Patch(':id/toggle-status')
  @RequireRole('admin')
  async toggleStatus(@Param('id') id: string) {
    return this.groupFamilyPackagesService.toggleStatus(id);
  }

  @Patch(':id/toggle-popular')
  @RequireRole('admin')
  async togglePopular(@Param('id') id: string) {
    return this.groupFamilyPackagesService.togglePopular(id);
  }

  @Delete(':id')
  @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.groupFamilyPackagesService.remove(id);
  }
}