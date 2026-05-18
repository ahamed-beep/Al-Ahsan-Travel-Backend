import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GroupFamilyPackageDocument,
  GroupFamilyPackageEntity,
} from './entities/group-family-package.entity';
import { CreateGroupFamilyPackageDto } from './dto/create-group-family-package.dto';
import { UpdateGroupFamilyPackageDto } from './dto/update-group-family-package.dto';
import { GroupFamilyPackageFilterDto } from './dto/group-family-package-filter.dto';
import { GroupFamilyPackageCategory } from './enums/group-family-package.enum';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Injectable()
export class GroupFamilyPackagesService {
  constructor(
    @InjectModel(GroupFamilyPackageEntity.name)
    private readonly packageModel: Model<GroupFamilyPackageDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateGroupFamilyPackageDto,
    file?: Express.Multer.File,
  ): Promise<GroupFamilyPackageDocument> {
    try {
      let imageUrl: string | null = null;
      let imagePublicId: string | null = null;

      if (file) {
        const uploaded = await this.cloudinaryService.uploadImageWebP(
          file.buffer,
          'group-family-packages',
        );
        imageUrl = uploaded.secure_url;
        imagePublicId = uploaded.public_id;
      }

      const created = new this.packageModel({ ...dto, imageUrl, imagePublicId });
      const saved = await created.save();
      return saved.toObject() as GroupFamilyPackageDocument;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Package create karne mein error: ${message}`);
    }
  }

  async findAll(filters: GroupFamilyPackageFilterDto): Promise<GroupFamilyPackageDocument[]> {
    try {
      const query: Record<string, unknown> = {};
      if (filters.category !== undefined) query.category = filters.category;
      if (filters.starRating !== undefined) query.starRating = filters.starRating;
      if (filters.popular !== undefined) query.popular = filters.popular;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
      return await this.packageModel.find(query).sort({ createdAt: -1 }).lean().exec() as GroupFamilyPackageDocument[];
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Packages fetch karne mein error: ${message}`);
    }
  }

  async findByCategory(category: GroupFamilyPackageCategory): Promise<GroupFamilyPackageDocument[]> {
    try {
      return await this.packageModel
        .find({ category: category as GroupFamilyPackageCategory, isActive: true })
        .sort({ popular: -1, starRating: 1, createdAt: -1 })
        .lean()
        .exec() as GroupFamilyPackageDocument[];
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Category se packages fetch karne mein error: ${message}`);
    }
  }

  async findOne(id: string): Promise<GroupFamilyPackageDocument> {
    try {
      const pkg = await this.packageModel.findById(id).lean().exec();
      if (!pkg) throw new NotFoundException(`Package ${id} nahi mila`);
      return pkg as GroupFamilyPackageDocument;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Package fetch karne mein error: ${message}`);
    }
  }

  async update(
    id: string,
    dto: UpdateGroupFamilyPackageDto,
    file?: Express.Multer.File,
  ): Promise<GroupFamilyPackageDocument> {
    try {
      const pkg = await this.packageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Package ${id} nahi mila`);

      if (file) {
        if (pkg.imagePublicId) {
          await this.cloudinaryService.deleteImage(pkg.imagePublicId);
        }
        const uploaded = await this.cloudinaryService.uploadImageWebP(
          file.buffer,
          'group-family-packages',
        );
        pkg.imageUrl = uploaded.secure_url;
        pkg.imagePublicId = uploaded.public_id;
      }

      if (dto.title !== undefined) pkg.title = dto.title;
      if (dto.duration !== undefined) pkg.duration = dto.duration;
      if (dto.makkahHotel !== undefined) pkg.makkahHotel = dto.makkahHotel;
      if (dto.madinahHotel !== undefined) pkg.madinahHotel = dto.madinahHotel;
      if (dto.price !== undefined) pkg.price = dto.price;
      if (dto.hotelLabel !== undefined) pkg.hotelLabel = dto.hotelLabel;
      if (dto.starRating !== undefined) pkg.starRating = dto.starRating;
      if (dto.category !== undefined) pkg.category = dto.category;
      if (dto.popular !== undefined) pkg.popular = dto.popular;
      if (dto.isActive !== undefined) pkg.isActive = dto.isActive;

      // Feature flags
      if (dto.includesFlight !== undefined) pkg.includesFlight = dto.includesFlight;
      if (dto.includesVisa !== undefined) pkg.includesVisa = dto.includesVisa;
      if (dto.includesTransport !== undefined) pkg.includesTransport = dto.includesTransport;
      if (dto.includesGuide !== undefined) pkg.includesGuide = dto.includesGuide;

      const saved = await pkg.save();
      return saved.toObject() as GroupFamilyPackageDocument;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Package update karne mein error: ${message}`);
    }
  }

  async toggleStatus(id: string): Promise<GroupFamilyPackageDocument> {
    try {
      const pkg = await this.packageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Package ${id} nahi mila`);
      pkg.isActive = !pkg.isActive;
      const saved = await pkg.save();
      return saved.toObject() as GroupFamilyPackageDocument;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Status toggle karne mein error: ${message}`);
    }
  }

  async togglePopular(id: string): Promise<GroupFamilyPackageDocument> {
    try {
      const pkg = await this.packageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Package ${id} nahi mila`);
      pkg.popular = !pkg.popular;
      const saved = await pkg.save();
      return saved.toObject() as GroupFamilyPackageDocument;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Popular toggle karne mein error: ${message}`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const pkg = await this.packageModel.findById(id).exec();
      if (!pkg) throw new NotFoundException(`Package ${id} nahi mila`);
      if (pkg.imagePublicId) {
        await this.cloudinaryService.deleteImage(pkg.imagePublicId);
      }
      await this.packageModel.findByIdAndDelete(id).exec();
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Package delete karne mein error: ${message}`);
    }
  }
}