// pricing-package/pricing-package.controller.ts
import {
  Controller, Get, Post, Patch,
  Delete, Param, Body, Query,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { PricingPackageService } from './pricing-package.service';
import { CreatePricingPackageDto } from './dto/create-pricing-package.dto';
import { UpdatePricingPackageDto } from './dto/update-pricing-package.dto';
import { ResponsePricingPackageDto } from './dto/response-pricing-package.dto';
import { PackageCategory } from './enums/package-category.enum';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveUserGuard } from 'src/common/guards/active-user.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('pricing-packages')
@SerializeResponse(ResponsePricingPackageDto)
@UseGuards(JwtAuthGuard, ActiveUserGuard, RolesGuard)
export class PricingPackageController {
  constructor(private readonly service: PricingPackageService) {}

  // Public routes — koi bhi dekh sakta hai
  @Public()
  @Get()
  async findAll(@Query('category') category?: PackageCategory) {
    try {
      return await this.service.findAll(category);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch packages');
    }
  }

  @Public()
  @Get('category/:category')
  async findByCategory(@Param('category') category: PackageCategory) {
    try {
      return await this.service.findByCategory(category);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.service.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  // Admin only routes
  @RequireRole('admin')
  @Post()
  async create(@Body() dto: CreatePricingPackageDto) {
    try {
      return await this.service.create(dto);
    } catch (error) {
      throw error;
    }
  }

  @RequireRole('admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePricingPackageDto,
  ) {
    try {
      return await this.service.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @RequireRole('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.service.remove(id);
    } catch (error) {
      throw error;
    }
  }
}