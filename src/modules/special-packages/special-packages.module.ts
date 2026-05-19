import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialPackagesController } from './special-packages.controller';
import { SpecialPackagesService } from './special-packages.service';
import {
  SpecialPackage,
  SpecialPackageSchema,
} from './entities/special-package.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpecialPackage.name, schema: SpecialPackageSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [SpecialPackagesController],
  providers: [SpecialPackagesService],
  exports: [SpecialPackagesService],
})
export class SpecialPackagesModule {}