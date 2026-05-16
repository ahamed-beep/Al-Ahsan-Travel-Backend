import { PartialType } from '@nestjs/mapped-types';
import { CreateShiftingHajjPackageDto } from './create-shifting-hajj-package.dto';

export class UpdateShiftingHajjPackageDto extends PartialType(CreateShiftingHajjPackageDto) {}