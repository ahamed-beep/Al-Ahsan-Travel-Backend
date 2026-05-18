// pricing-package/pricing-package.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePricingPackageDto } from './dto/create-pricing-package.dto';
import { UpdatePricingPackageDto } from './dto/update-pricing-package.dto';
import { PackageCategory } from './enums/package-category.enum';
import { IPricingPackage } from './interfaces/pricing-package.interface';
import { PricingPackage, PricingPackageDocument } from './entities/pricing-package.entity';

@Injectable()
export class PricingPackageService {
  constructor(
    @InjectModel(PricingPackage.name)
    private readonly model: Model<PricingPackageDocument>,
  ) {}

  // GET ALL — optional category filter
  async findAll(category?: PackageCategory): Promise<IPricingPackage[]> {
    try {
      const filter = category ? { category } : {};
      return await this.model.find(filter).lean();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch packages');
    }
  }

  // GET BY CATEGORY — 3 pages ke liye
  async findByCategory(category: PackageCategory): Promise<IPricingPackage[]> {
    try {
      const packages = await this.model.find({ category }).lean();
      if (!packages.length) {
        throw new NotFoundException(
          `No packages found for category: ${category}`,
        );
      }
      return packages;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch packages by category');
    }
  }

  // GET ONE
  async findOne(id: string): Promise<IPricingPackage> {
    try {
      const pkg = await this.model.findById(id).lean();
      if (!pkg) throw new NotFoundException(`Package with id ${id} not found`);
      return pkg;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch package');
    }
  }

  // CREATE
  async create(dto: CreatePricingPackageDto): Promise<IPricingPackage> {
    try {
      const pkg = new this.model(dto);
      return await pkg.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create package');
    }
  }

  // UPDATE
  async update(id: string, dto: UpdatePricingPackageDto): Promise<IPricingPackage> {
    try {
      const pkg = await this.model
        .findByIdAndUpdate(id, dto, { new: true })
        .lean();
      if (!pkg) throw new NotFoundException(`Package with id ${id} not found`);
      return pkg;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update package');
    }
  }

  // DELETE
  async remove(id: string): Promise<{ message: string }> {
    try {
      const pkg = await this.model.findByIdAndDelete(id).lean();
      if (!pkg) throw new NotFoundException(`Package with id ${id} not found`);
      return { message: `Package ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete package');
    }
  }
}