import { PartialType } from '@nestjs/mapped-types';
import { CreateMonthlyUmrahPackageDto } from './create-monthly-umrah-package.dto';

export class UpdateMonthlyUmrahPackageDto extends PartialType(CreateMonthlyUmrahPackageDto) {}