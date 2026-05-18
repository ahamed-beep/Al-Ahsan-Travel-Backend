import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GroupFamilyPackageEntity,
  GroupFamilyPackageSchema,
} from './entities/group-family-package.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { GroupFamilyPackagesController } from './group-family-package.controller';
import { GroupFamilyPackagesService } from './group-family-package.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GroupFamilyPackageEntity.name,
        schema: GroupFamilyPackageSchema,
      },
    ]),
    CloudinaryModule,
  ],
  controllers: [GroupFamilyPackagesController],
  providers: [GroupFamilyPackagesService],
  exports: [GroupFamilyPackagesService],
})
export class GroupFamilyPackagesModule {}