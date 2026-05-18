import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UmrahPackageEntity, UmrahPackageSchema } from './entities/umrah-package.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { UmrahPackagesController } from './umrah-package.controller';
import { UmrahPackagesService } from './umrah-package.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UmrahPackageEntity.name, schema: UmrahPackageSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [UmrahPackagesController],
  providers: [UmrahPackagesService],
  exports: [UmrahPackagesService],
})
export class UmrahPackagesModule {}