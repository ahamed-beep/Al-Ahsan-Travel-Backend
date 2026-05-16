import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ShiftingHajjPackage,
  ShiftingHajjPackageDocument,
} from './entities/shifting-hajj-package.schema';
import { CreateShiftingHajjPackageDto } from './dto/create-shifting-hajj-package.dto';
import { UpdateShiftingHajjPackageDto } from './dto/update-shifting-hajj-package.dto';
import { ShiftingHajjPackageStatus } from './enums/shifting-hajj-package.enum';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';

@Injectable()
export class ShiftingHajjPackageService {
  private readonly logger = new Logger(ShiftingHajjPackageService.name);

  constructor(
    @InjectModel(ShiftingHajjPackage.name)
    private readonly shiftingHajjPackageModel: Model<ShiftingHajjPackageDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<ShiftingHajjPackageDocument[]> {
    try {
      return await this.shiftingHajjPackageModel
        .find({ status: ShiftingHajjPackageStatus.ACTIVE })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error: unknown) {
      this.logger.error('findAll error:', error);
      throw new InternalServerErrorException('Failed to fetch shifting hajj packages');
    }
  }

  async findAllAdmin(): Promise<ShiftingHajjPackageDocument[]> {
    try {
      return await this.shiftingHajjPackageModel.find().sort({ createdAt: -1 }).exec();
    } catch (error: unknown) {
      this.logger.error('findAllAdmin error:', error);
      throw new InternalServerErrorException('Failed to fetch shifting hajj packages');
    }
  }

  async findOne(id: string): Promise<ShiftingHajjPackageDocument> {
    try {
      const pkg = await this.shiftingHajjPackageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Shifting Hajj Package #${id} not found`);
      return pkg;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('findOne error:', error);
      throw new InternalServerErrorException('Failed to fetch shifting hajj package');
    }
  }

  async create(
    dto: CreateShiftingHajjPackageDto,
    imageFile: Express.Multer.File,
  ): Promise<ShiftingHajjPackageDocument> {
    try {
      const uploaded = await this.cloudinaryService.uploadImageWebP(
        imageFile.buffer,
        imageFile.mimetype,
        'shifting-hajj-packages',
      );

      const pkg = new this.shiftingHajjPackageModel({
        ...dto,
        locations: dto.locations ?? [],
        tags: dto.tags ?? [],
        popular: dto.popular ?? false,
        imageUrl: uploaded.secure_url,
        imagePublicId: uploaded.public_id,
      });

      return await pkg.save();
    } catch (error: unknown) {
      this.logger.error('create error:', error);
      throw new InternalServerErrorException('Failed to create shifting hajj package');
    }
  }

  async update(
    id: string,
    dto: UpdateShiftingHajjPackageDto,
    imageFile?: Express.Multer.File,
  ): Promise<ShiftingHajjPackageDocument> {
    try {
      const pkg = await this.shiftingHajjPackageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Shifting Hajj Package #${id} not found`);

      if (imageFile) {
        if (pkg.imagePublicId) {
          await this.cloudinaryService.deleteImage(pkg.imagePublicId);
        }
        const uploaded = await this.cloudinaryService.uploadImageWebP(
          imageFile.buffer,
          imageFile.mimetype,
          'shifting-hajj-packages',
        );
        pkg.imageUrl = uploaded.secure_url;
        pkg.imagePublicId = uploaded.public_id;
      }

      Object.assign(pkg, dto);
      return await pkg.save();
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('update error:', error);
      throw new InternalServerErrorException('Failed to update shifting hajj package');
    }
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const pkg = await this.shiftingHajjPackageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Shifting Hajj Package #${id} not found`);

      if (pkg.imagePublicId) {
        await this.cloudinaryService.deleteImage(pkg.imagePublicId);
      }

      await this.shiftingHajjPackageModel.findByIdAndDelete(id).exec();
      return { success: true, message: 'Shifting Hajj Package deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('remove error:', error);
      throw new InternalServerErrorException('Failed to delete shifting hajj package');
    }
  }

  async toggleStatus(id: string): Promise<ShiftingHajjPackageDocument> {
    try {
      const pkg = await this.shiftingHajjPackageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Shifting Hajj Package #${id} not found`);

      pkg.status =
        pkg.status === ShiftingHajjPackageStatus.ACTIVE
          ? ShiftingHajjPackageStatus.INACTIVE
          : ShiftingHajjPackageStatus.ACTIVE;

      return await pkg.save();
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('toggleStatus error:', error);
      throw new InternalServerErrorException('Failed to toggle status');
    }
  }

  async togglePopular(id: string): Promise<ShiftingHajjPackageDocument> {
    try {
      const pkg = await this.shiftingHajjPackageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Shifting Hajj Package #${id} not found`);

      pkg.popular = !pkg.popular;
      return await pkg.save();
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('togglePopular error:', error);
      throw new InternalServerErrorException('Failed to toggle popular');
    }
  }
}