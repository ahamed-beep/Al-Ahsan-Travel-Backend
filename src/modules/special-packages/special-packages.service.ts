import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SpecialPackage,
  SpecialPackageDocument,
} from './entities/special-package.entity';
import {
  CreateSpecialPackageDto,
  UpdateSpecialPackageDto,
  FilterSpecialPackageDto,
} from './dto/special-package.dto';
import {
  IServiceResponse,
  IPaginatedResponse,
  ISpecialPackageResponse,
} from './interfaces/special-package.interface';
import { PackageCategory } from './enums/special-package.enum';

@Injectable()
export class SpecialPackagesService {
  constructor(
    @InjectModel(SpecialPackage.name)
    private readonly specialPackageModel: Model<SpecialPackageDocument>,
  ) {}

  async create(
    dto: CreateSpecialPackageDto,
  ): Promise<IServiceResponse<ISpecialPackageResponse>> {
    try {
      const created = await this.specialPackageModel.create({ ...dto });
      return {
        success: true,
        message: 'Special package created successfully',
        data: created.toObject() as unknown as ISpecialPackageResponse,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to create special package: ${message}`,
      );
    }
  }

  async findAll(
    filters: FilterSpecialPackageDto,
  ): Promise<IPaginatedResponse<ISpecialPackageResponse>> {
    try {
      const { category, isActive, page = 1, limit = 10 } = filters;
      const query: Record<string, unknown> = {};

      if (category) query.category = category;
      if (isActive !== undefined) query.isActive = isActive;

      const skip = (page - 1) * limit;

      const [packages, total] = await Promise.all([
        this.specialPackageModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean()
          .exec(),
        this.specialPackageModel.countDocuments(query).exec(),
      ]);

      return {
        success: true,
        message: 'Special packages fetched successfully',
        data: packages as unknown as ISpecialPackageResponse[],
        total,
        page,
        limit,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to fetch special packages: ${message}`,
      );
    }
  }

  async findByCategory(
    category: PackageCategory,
  ): Promise<IServiceResponse<ISpecialPackageResponse[]>> {
    try {
      const packages = await this.specialPackageModel
        .find({ category, isActive: true })
        .sort({ stars: 1 })
        .lean()
        .exec();

      if (!packages.length) {
        throw new NotFoundException(
          `No packages found for category: ${category}`,
        );
      }

      return {
        success: true,
        message: `Packages for category '${category}' fetched successfully`,
        data: packages as unknown as ISpecialPackageResponse[],
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to fetch packages by category: ${message}`,
      );
    }
  }

  // special-packages.service.ts

async togglePopular(
  id: string,
): Promise<IServiceResponse<ISpecialPackageResponse>> {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid package ID: ${id}`);
    }

    const pkg = await this.specialPackageModel.findById(id).exec();

    if (!pkg) {
      throw new NotFoundException(`Special package with ID '${id}' not found`);
    }

    pkg.isPopular = !pkg.isPopular;
    const saved = await pkg.save();

    return {
      success: true,
      message: `Package ${saved.isPopular ? 'marked as popular' : 'removed from popular'} successfully`,
      data: saved.toObject() as unknown as ISpecialPackageResponse,
    };
  } catch (error: unknown) {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    throw new InternalServerErrorException(
      `Failed to toggle package popular status: ${message}`,
    );
  }
}

  async findOne(
    id: string,
  ): Promise<IServiceResponse<ISpecialPackageResponse>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid package ID: ${id}`);
      }

      const pkg = await this.specialPackageModel.findById(id).lean().exec();

      if (!pkg) {
        throw new NotFoundException(`Special package with ID '${id}' not found`);
      }

      return {
        success: true,
        message: 'Special package fetched successfully',
        data: pkg as unknown as ISpecialPackageResponse,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to fetch special package: ${message}`,
      );
    }
  }

  async update(
    id: string,
    dto: UpdateSpecialPackageDto,
  ): Promise<IServiceResponse<ISpecialPackageResponse>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid package ID: ${id}`);
      }

      const updated = await this.specialPackageModel
        .findByIdAndUpdate(
          id,
          { $set: { ...dto } },
          { new: true, runValidators: true },
        )
        .lean()
        .exec();

      if (!updated) {
        throw new NotFoundException(`Special package with ID '${id}' not found`);
      }

      return {
        success: true,
        message: 'Special package updated successfully',
        data: updated as unknown as ISpecialPackageResponse,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to update special package: ${message}`,
      );
    }
  }

  async remove(id: string): Promise<IServiceResponse<null>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid package ID: ${id}`);
      }

      const deleted = await this.specialPackageModel
        .findByIdAndDelete(id)
        .lean()
        .exec();

      if (!deleted) {
        throw new NotFoundException(`Special package with ID '${id}' not found`);
      }

      return {
        success: true,
        message: 'Special package deleted successfully',
        data: null,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to delete special package: ${message}`,
      );
    }
  }

  async toggleActive(
    id: string,
  ): Promise<IServiceResponse<ISpecialPackageResponse>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid package ID: ${id}`);
      }

      const pkg = await this.specialPackageModel.findById(id).exec();

      if (!pkg) {
        throw new NotFoundException(`Special package with ID '${id}' not found`);
      }

      pkg.isActive = !pkg.isActive;
      const saved = await pkg.save();

      return {
        success: true,
        message: `Package ${saved.isActive ? 'activated' : 'deactivated'} successfully`,
        data: saved.toObject() as unknown as ISpecialPackageResponse,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to toggle package status: ${message}`,
      );
    }
  }
}