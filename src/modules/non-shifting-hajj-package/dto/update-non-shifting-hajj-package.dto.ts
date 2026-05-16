import { PartialType } from '@nestjs/mapped-types';
import { CreateNonShiftingHajjPackageDto } from './create-non-shifting-hajj-package.dto';

export class UpdateNonShiftingHajjPackageDto extends PartialType(CreateNonShiftingHajjPackageDto) {}