import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupFamilyPackageDto } from './create-group-family-package.dto';

export class UpdateGroupFamilyPackageDto extends PartialType(
  CreateGroupFamilyPackageDto,
) {}