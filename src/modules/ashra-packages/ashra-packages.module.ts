import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AshraPackagesController } from './ashra-packages.controller';
import { AshraPackagesService } from './ashra-packages.service';
import { AshraPackage, AshraPackageSchema } from './entities/ashra-package.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AshraPackage.name, schema: AshraPackageSchema }]),
    CloudinaryModule,
  ],
  controllers: [AshraPackagesController],
  providers: [AshraPackagesService],
  exports: [AshraPackagesService],
})
export class AshraPackagesModule {}