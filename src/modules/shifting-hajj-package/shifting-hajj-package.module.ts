import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShiftingHajjPackageController } from './shifting-hajj-package.controller';
import { ShiftingHajjPackageService } from './shifting-hajj-package.service';
import {
  ShiftingHajjPackage,
  ShiftingHajjPackageSchema,
} from './entities/shifting-hajj-package.schema';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShiftingHajjPackage.name, schema: ShiftingHajjPackageSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [ShiftingHajjPackageController],
  providers: [ShiftingHajjPackageService],
  exports: [ShiftingHajjPackageService],
})
export class ShiftingHajjPackageModule {}