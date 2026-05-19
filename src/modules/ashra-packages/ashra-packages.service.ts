import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAshraPackageDto } from './dto/create-ashra-package.dto';
import { UpdateAshraPackageDto } from './dto/update-ashra-package.dto';
import { AshraCategoryEnum } from './enums/ashra-category.enum';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { AshraPackage, AshraPackageDocument } from './entities/ashra-package.entity';

@Injectable()
export class AshraPackagesService {
  constructor(
    @InjectModel(AshraPackage.name)
    private readonly ashraModel: Model<AshraPackageDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateAshraPackageDto,
    file: Express.Multer.File,
  ): Promise<{ success: boolean; message: string; data: AshraPackageDocument }> {
    try {
      const uploaded = await this.cloudinaryService.uploadImageWebP(
        file.buffer,
        'ashra-packages',
      );

      const created = await this.ashraModel.create({ ...dto, image: uploaded.secure_url });

      return { success: true, message: 'Package created successfully', data: created };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(message);
    }
  }

  async findByCategory(
    category: AshraCategoryEnum,
  ): Promise<{ success: boolean; message: string; data: AshraPackageDocument[] }> {
    try {
      const packages = await this.ashraModel
        .find({ category })
        .sort({ isPopular: -1, _id: 1 })
        .lean()
        .exec();

      return { success: true, message: 'Packages fetched successfully', data: packages as AshraPackageDocument[] };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(message);
    }
  }

  async findOne(
    id: string,
  ): Promise<{ success: boolean; message: string; data: AshraPackageDocument }> {
    try {
      const pkg = await this.ashraModel.findById(id).lean().exec();
      if (!pkg) throw new NotFoundException(`Package with id ${id} not found`);

      return { success: true, message: 'Package fetched successfully', data: pkg as AshraPackageDocument };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(message);
    }
  }

  async update(
    id: string,
    dto: UpdateAshraPackageDto,
    file?: Express.Multer.File,
  ): Promise<{ success: boolean; message: string; data: AshraPackageDocument }> {
    try {
      const pkg = await this.ashraModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Package with id ${id} not found`);

      if (file) {
        if (pkg.image) {
          const publicId = this.cloudinaryService.extractPublicId(pkg.image);
          await this.cloudinaryService.deleteImage(publicId);
        }
        const uploaded = await this.cloudinaryService.uploadImageWebP(
          file.buffer,
          'ashra-packages',
        );
        dto.image = uploaded.secure_url;
      }

      const updated = await this.ashraModel
        .findByIdAndUpdate(id, { $set: dto }, { new: true })
        .lean()
        .exec();

      return { success: true, message: 'Package updated successfully', data: updated as AshraPackageDocument };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(message);
    }
  }

  async remove(
    id: string,
  ): Promise<{ success: boolean; message: string; data: null }> {
    try {
      const pkg = await this.ashraModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Package with id ${id} not found`);

      if (pkg.image) {
        const publicId = this.cloudinaryService.extractPublicId(pkg.image);
        await this.cloudinaryService.deleteImage(publicId);
      }

      await this.ashraModel.findByIdAndDelete(id).exec();

      return { success: true, message: 'Package deleted successfully', data: null };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(message);
    }
  }
}