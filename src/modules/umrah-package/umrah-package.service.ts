import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UmrahPackageEntity, UmrahPackageDocument } from './entities/umrah-package.entity';
import { UmrahPackageCategory } from './enums/umrah-package.enum';
import { UpdateUmrahPackageDto } from './dto/update-umrah-package.dto';
import { UmrahPackageFilterDto } from './dto/umrah-package-filter.dto';
import { CreateUmrahPackageDto } from './dto/create-umrah-package.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Injectable()
export class UmrahPackagesService {
  constructor(
    @InjectModel(UmrahPackageEntity.name)
    private readonly umrahPackageModel: Model<UmrahPackageDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createUmrahPackageDto: CreateUmrahPackageDto,
    file?: Express.Multer.File,
  ): Promise<UmrahPackageDocument> {
    try {
      let imageUrl: string | null = null;
      let imagePublicId: string | null = null;

      if (file) {
        const uploaded = await this.cloudinaryService.uploadImageWebP(
          file.buffer,
          'umrah-packages',
        );
        imageUrl = uploaded.secure_url;
        imagePublicId = uploaded.public_id;
      }

      const umrahPackage = new this.umrahPackageModel({
        ...createUmrahPackageDto,
        imageUrl,
        imagePublicId,
      });

      return await umrahPackage.save();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to create umrah package: ${message}`,
      );
    }
  }

  async findAll(filters: UmrahPackageFilterDto): Promise<UmrahPackageDocument[]> {
    try {
      const query: Record<string, unknown> = {};

      if (filters.category !== undefined) query.category = filters.category;
      if (filters.starRating !== undefined) query.starRating = filters.starRating;
      if (filters.includesFlight !== undefined) query.includesFlight = filters.includesFlight;
      query.isActive = filters.isActive !== undefined ? filters.isActive : true;

      return await this.umrahPackageModel.find(query).exec();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to fetch umrah packages: ${message}`,
      );
    }
  }

  async findOne(id: string): Promise<UmrahPackageDocument> {
    try {
      const umrahPackage = await this.umrahPackageModel.findById(id).exec();

      if (!umrahPackage) {
        throw new NotFoundException(`Umrah package with id ${id} not found`);
      }

      return umrahPackage;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to fetch umrah package: ${message}`,
      );
    }
  }

  async update(
    id: string,
    updateUmrahPackageDto: UpdateUmrahPackageDto,
    file?: Express.Multer.File,
  ): Promise<UmrahPackageDocument> {
    try {
      const umrahPackage = await this.findOne(id);

      if (file) {
        if (umrahPackage.imagePublicId) {
          await this.cloudinaryService.deleteImage(umrahPackage.imagePublicId);
        }

        const uploaded = await this.cloudinaryService.uploadImageWebP(
          file.buffer,
          'umrah-packages',
        );
        umrahPackage.imageUrl = uploaded.secure_url;
        umrahPackage.imagePublicId = uploaded.public_id;
      }

      Object.assign(umrahPackage, updateUmrahPackageDto);

      return await umrahPackage.save();
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to update umrah package: ${message}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const umrahPackage = await this.findOne(id);

      if (umrahPackage.imagePublicId) {
        await this.cloudinaryService.deleteImage(umrahPackage.imagePublicId);
      }

      await this.umrahPackageModel.findByIdAndDelete(id).exec();
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to delete umrah package: ${message}`,
      );
    }
  }

  async findByCategory(category: string): Promise<UmrahPackageDocument[]> {
    try {
      return await this.umrahPackageModel
        .find({ category: category as UmrahPackageCategory, isActive: true })
        .exec();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to fetch umrah packages by category: ${message}`,
      );
    }
  }
}