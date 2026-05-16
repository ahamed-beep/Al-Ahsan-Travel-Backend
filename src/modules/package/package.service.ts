import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, PackageDocument } from './entities/package.schema';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';

const CLOUDINARY_FOLDER = 'packages';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createPackageDto: CreatePackageDto,
    imageFile: Express.Multer.File,
  ): Promise<PackageDocument> {
    try {
      if (!imageFile) {
        throw new BadRequestException('Package image is required');
      }

      const uploadResult = await this.cloudinaryService.uploadImageWebP(
        imageFile.buffer,
        CLOUDINARY_FOLDER,
      );

      const pkg = await this.packageModel.create({
        ...createPackageDto,
        imageUrl: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
      });

      return pkg;
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Error creating package: ${message}`);
    }
  }

  async findAll(): Promise<PackageDocument[]> {
    try {
      return await this.packageModel.find().sort({ createdAt: -1 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Error fetching packages: ${message}`);
    }
  }

  async findOne(id: string): Promise<PackageDocument> {
    try {
      const pkg = await this.packageModel.findById(id);
      if (!pkg) {
        throw new NotFoundException('Package not found');
      }
      return pkg;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Error fetching package: ${message}`);
    }
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
    imageFile?: Express.Multer.File,
  ): Promise<PackageDocument> {
    try {
      const pkg = await this.packageModel.findById(id);
      if (!pkg) {
        throw new NotFoundException('Package not found');
      }

      let imageFields: { imageUrl?: string; imagePublicId?: string } = {};

      if (imageFile?.buffer) {
        await this.cloudinaryService.deleteImage(pkg.imagePublicId);

        const uploadResult = await this.cloudinaryService.uploadImageWebP(
          imageFile.buffer,
          CLOUDINARY_FOLDER,
        );

        imageFields = {
          imageUrl: uploadResult.secure_url,
          imagePublicId: uploadResult.public_id,
        };
      }

      const updated = await this.packageModel.findByIdAndUpdate(
        id,
        { ...updatePackageDto, ...imageFields },
        { new: true },
      );

      return updated;
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Error updating package: ${message}`);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const pkg = await this.packageModel.findById(id);
      if (!pkg) {
        throw new NotFoundException('Package not found');
      }

      await this.cloudinaryService.deleteImage(pkg.imagePublicId);
      await this.packageModel.findByIdAndDelete(id);

      return { message: 'Package deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Error deleting package: ${message}`);
    }
  }

  async toggleStatus(id: string): Promise<{ message: string }> {
    try {
      const pkg = await this.packageModel.findById(id);
      if (!pkg) {
        throw new NotFoundException('Package not found');
      }

      const newStatus = pkg.status === 'active' ? 'inactive' : 'active';
      await this.packageModel.findByIdAndUpdate(id, { status: newStatus });

      return {
        message: `Package ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Error toggling package status: ${message}`);
    }
  }
}