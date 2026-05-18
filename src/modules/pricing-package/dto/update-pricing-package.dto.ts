// pricing-package/dto/update-pricing-package.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePricingPackageDto } from './create-pricing-package.dto';

export class UpdatePricingPackageDto extends PartialType(CreatePricingPackageDto) {}