import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NonShiftingHajjPackageController } from './non-shifting-hajj-package.controller';
import { NonShiftingHajjPackageService } from './non-shifting-hajj-package.service';
import {
  NonShiftingHajjPackage,
  NonShiftingHajjPackageSchema,
} from './entities/non-shifting-hajj-package.schema';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NonShiftingHajjPackage.name, schema: NonShiftingHajjPackageSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [NonShiftingHajjPackageController],
  providers: [NonShiftingHajjPackageService],
  exports: [NonShiftingHajjPackageService],
})
export class NonShiftingHajjPackageModule {}