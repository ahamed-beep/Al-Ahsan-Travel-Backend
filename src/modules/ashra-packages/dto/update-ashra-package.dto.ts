import { PartialType } from '@nestjs/mapped-types';
import { CreateAshraPackageDto } from './create-ashra-package.dto';

export class UpdateAshraPackageDto extends PartialType(CreateAshraPackageDto) {}