import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MonthlyUmrahPackage,
  MonthlyUmrahPackageDocument,
} from './entities/monthly-umrah-package.schema';
import { CreateMonthlyUmrahPackageDto } from './dto/create-monthly-umrah-package.dto';
import { UpdateMonthlyUmrahPackageDto } from './dto/update-monthly-umrah-package.dto';
import { IApiResponse, IPackageQuery } from './interfaces/monthly-umrah-package.interface';
import { UmrahMonth } from './enums/umrah-month.enum';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Injectable()
export class MonthlyUmrahPackagesService {
  constructor(
    @InjectModel(MonthlyUmrahPackage.name)
    private readonly packageModel: Model<MonthlyUmrahPackageDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateMonthlyUmrahPackageDto,
    images: Express.Multer.File[],
  ): Promise<IApiResponse<MonthlyUmrahPackageDocument>> {
    const exists = await this.packageModel.findOne({
      month: dto.month,
      starCategory: dto.starCategory,
    });

    if (exists) {
      throw new ConflictException(
        `Package already exists for ${dto.month} - ${dto.starCategory}-Star`,
      );
    }

    const packagesWithImages = await Promise.all(
      dto.packages.map(async (pkg, index) => {
        if (images && images[index]) {
          const uploaded = await this.cloudinaryService.uploadImageWebP(
            images[index].buffer,
            'monthly-umrah-packages',
          );
          return { ...pkg, image: uploaded.secure_url };
        }
        return { ...pkg, image: '' };
      }),
    );

    const created = await this.packageModel.create({
      ...dto,
      packages: packagesWithImages,
    });

    return {
      success: true,
      message: 'Package created successfully',
      data: created,
    };
  }

  async findAll(
    query: IPackageQuery,
  ): Promise<IApiResponse<MonthlyUmrahPackageDocument[]>> {
    const filter: Record<string, unknown> = {};
    if (query.month) filter.month = query.month;
    if (query.starCategory) filter.starCategory = query.starCategory;
    if (query.isActive !== undefined) filter.isActive = query.isActive;

    const data = await this.packageModel
      .find(filter)
      .sort({ month: 1, starCategory: 1 })
      .lean()
      .exec();

    return {
      success: true,
      message: 'Packages fetched successfully',
      data,
    };
  }

  async findByMonth(
    month: UmrahMonth,
  ): Promise<IApiResponse<MonthlyUmrahPackageDocument[]>> {
    const data = await this.packageModel
      .find({ month, isActive: true })
      .sort({ starCategory: 1 })
      .lean()
      .exec();

    if (!data.length) {
      throw new NotFoundException(`No packages found for month: ${month}`);
    }

    return {
      success: true,
      message: `Packages for ${month} fetched successfully`,
      data,
    };
  }

  async findOne(
    id: string,
  ): Promise<IApiResponse<MonthlyUmrahPackageDocument>> {
    const data = await this.packageModel.findById(id).lean().exec();
    if (!data) throw new NotFoundException(`Package with id ${id} not found`);

    return {
      success: true,
      message: 'Package fetched successfully',
      data,
    };
  }

 async update(
  id: string,
  dto: UpdateMonthlyUmrahPackageDto,
  images: Express.Multer.File[],
): Promise<IApiResponse<MonthlyUmrahPackageDocument>> {
  const existing = await this.packageModel.findById(id);
  if (!existing) throw new NotFoundException(`Package with id ${id} not found`);

  // Form-data se packages parse karo manually
  const rawDto = dto as any;
  let parsedPackages: any[] = [];

  if (rawDto.packages && typeof rawDto.packages === 'object') {
    const pkgObj = rawDto.packages;
    const indices = Object.keys(pkgObj);
    parsedPackages = indices.map((i) => pkgObj[i]);
  }

  // Agar packages nahi aaye toh existing use karo
  let updatedPackages = parsedPackages.length > 0
    ? parsedPackages
    : existing.packages.map((p: any) => p.toObject());

  // Images handle karo
  updatedPackages = await Promise.all(
    updatedPackages.map(async (pkg: any, index: number) => {
      if (images && images[index]) {
        const oldImage = existing.packages[index]?.image;
        if (oldImage) {
          const publicId = this.cloudinaryService.extractPublicId(oldImage);
          await this.cloudinaryService.deleteImage(publicId);
        }
        const uploaded = await this.cloudinaryService.uploadImageWebP(
          images[index].buffer,
          'monthly-umrah-packages',
        );
        return { ...pkg, image: uploaded.secure_url };
      }
      return { ...pkg, image: existing.packages[index]?.image ?? '' };
    }),
  );

  const { packages: _, ...restDto } = rawDto;

  const updated = await this.packageModel
    .findByIdAndUpdate(
      id,
      { $set: { ...restDto, packages: updatedPackages } },
      { new: true, runValidators: true },
    )
    .lean()
    .exec();

  return {
    success: true,
    message: 'Package updated successfully',
    data: updated,
  };
}
  async remove(id: string): Promise<IApiResponse<null>> {
    const deleted = await this.packageModel.findById(id).lean().exec();
    if (!deleted) throw new NotFoundException(`Package with id ${id} not found`);

    // Cloudinary se sari images delete karo
    await Promise.all(
      deleted.packages.map(async (pkg) => {
        if (pkg.image) {
          const publicId = this.cloudinaryService.extractPublicId(pkg.image);
          await this.cloudinaryService.deleteImage(publicId);
        }
      }),
    );

    await this.packageModel.findByIdAndDelete(id);

    return {
      success: true,
      message: 'Package deleted successfully',
      data: null,
    };
  }

  async toggleActive(
    id: string,
  ): Promise<IApiResponse<MonthlyUmrahPackageDocument>> {
    const pkg = await this.packageModel.findById(id);
    if (!pkg) throw new NotFoundException(`Package with id ${id} not found`);

    pkg.isActive = !pkg.isActive;
    await pkg.save();

    return {
      success: true,
      message: `Package ${pkg.isActive ? 'activated' : 'deactivated'} successfully`,
      data: pkg,
    };
  }
}