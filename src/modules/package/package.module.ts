import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { Package, PackageSchema } from './entities/package.schema';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
    CloudinaryModule, 
  ],
  controllers: [PackageController],
  providers: [PackageService],
  exports: [PackageService],
})
export class PackageModule {}