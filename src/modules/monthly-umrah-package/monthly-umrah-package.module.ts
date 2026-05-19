import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonthlyUmrahPackage, MonthlyUmrahPackageSchema } from './entities/monthly-umrah-package.schema';
import { MonthlyUmrahPackagesController } from './monthly-umrah-package.controller';
import { MonthlyUmrahPackagesService } from './monthly-umrah-package.service';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MonthlyUmrahPackage.name,
        schema: MonthlyUmrahPackageSchema,
      },
    ]),
    CloudinaryModule,
  ],
  controllers: [MonthlyUmrahPackagesController],
  providers: [MonthlyUmrahPackagesService],
  exports: [MonthlyUmrahPackagesService],
})
export class MonthlyUmrahPackagesModule {}