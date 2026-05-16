import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NonShiftingHajjPackage,
  NonShiftingHajjPackageDocument,
} from './entities/non-shifting-hajj-package.schema';
import { CreateNonShiftingHajjPackageDto } from './dto/create-non-shifting-hajj-package.dto';
import { UpdateNonShiftingHajjPackageDto } from './dto/update-non-shifting-hajj-package.dto';
import { NonShiftingHajjPackageStatus } from './enums/non-shifting-hajj-package.enum';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';

@Injectable()
export class NonShiftingHajjPackageService {
  private readonly logger = new Logger(NonShiftingHajjPackageService.name);

  constructor(
    @InjectModel(NonShiftingHajjPackage.name)
    private readonly nonShiftingHajjPackageModel: Model<NonShiftingHajjPackageDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<NonShiftingHajjPackageDocument[]> {
    try {
      return await this.nonShiftingHajjPackageModel
        .find({ status: NonShiftingHajjPackageStatus.ACTIVE })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error: unknown) {
      this.logger.error('findAll error:', error);
      throw new InternalServerErrorException('Failed to fetch non-shifting hajj packages');
    }
  }

  async findAllAdmin(): Promise<NonShiftingHajjPackageDocument[]> {
    try {
      return await this.nonShiftingHajjPackageModel.find().sort({ createdAt: -1 }).exec();
    } catch (error: unknown) {
      this.logger.error('findAllAdmin error:', error);
      throw new InternalServerErrorException('Failed to fetch non-shifting hajj packages');
    }
  }

  async findOne(id: string): Promise<NonShiftingHajjPackageDocument> {
    try {
      const pkg = await this.nonShiftingHajjPackageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Non-Shifting Hajj Package #${id} not found`);
      return pkg;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('findOne error:', error);
      throw new InternalServerErrorException('Failed to fetch non-shifting hajj package');
    }
  }

  async create(
    dto: CreateNonShiftingHajjPackageDto,
    imageFile: Express.Multer.File,
  ): Promise<NonShiftingHajjPackageDocument> {
    try {
      const uploaded = await this.cloudinaryService.uploadImageWebP(
        imageFile.buffer,
        imageFile.mimetype,
        'non-shifting-hajj-packages',
      );

      const pkg = new this.nonShiftingHajjPackageModel({
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
      throw new InternalServerErrorException('Failed to create non-shifting hajj package');
    }
  }

  async update(
    id: string,
    dto: UpdateNonShiftingHajjPackageDto,
    imageFile?: Express.Multer.File,
  ): Promise<NonShiftingHajjPackageDocument> {
    try {
      const pkg = await this.nonShiftingHajjPackageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Non-Shifting Hajj Package #${id} not found`);

      if (imageFile) {
        if (pkg.imagePublicId) {
          await this.cloudinaryService.deleteImage(pkg.imagePublicId);
        }
        const uploaded = await this.cloudinaryService.uploadImageWebP(
          imageFile.buffer,
          imageFile.mimetype,
          'non-shifting-hajj-packages',
        );
        pkg.imageUrl = uploaded.secure_url;
        pkg.imagePublicId = uploaded.public_id;
      }

      Object.assign(pkg, dto);
      return await pkg.save();
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('update error:', error);
      throw new InternalServerErrorException('Failed to update non-shifting hajj package');
    }
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const pkg = await this.nonShiftingHajjPackageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Non-Shifting Hajj Package #${id} not found`);

      if (pkg.imagePublicId) {
        await this.cloudinaryService.deleteImage(pkg.imagePublicId);
      }

      await this.nonShiftingHajjPackageModel.findByIdAndDelete(id).exec();
      return { success: true, message: 'Non-Shifting Hajj Package deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('remove error:', error);
      throw new InternalServerErrorException('Failed to delete non-shifting hajj package');
    }
  }

  async toggleStatus(id: string): Promise<NonShiftingHajjPackageDocument> {
    try {
      const pkg = await this.nonShiftingHajjPackageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Non-Shifting Hajj Package #${id} not found`);

      pkg.status =
        pkg.status === NonShiftingHajjPackageStatus.ACTIVE
          ? NonShiftingHajjPackageStatus.INACTIVE
          : NonShiftingHajjPackageStatus.ACTIVE;

      return await pkg.save();
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('toggleStatus error:', error);
      throw new InternalServerErrorException('Failed to toggle status');
    }
  }

  async togglePopular(id: string): Promise<NonShiftingHajjPackageDocument> {
    try {
      const pkg = await this.nonShiftingHajjPackageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Non-Shifting Hajj Package #${id} not found`);

      pkg.popular = !pkg.popular;
      return await pkg.save();
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('togglePopular error:', error);
      throw new InternalServerErrorException('Failed to toggle popular');
    }
  }
}