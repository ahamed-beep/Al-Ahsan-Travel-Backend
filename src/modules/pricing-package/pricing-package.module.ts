// pricing-package/pricing-package.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PricingPackageService } from './pricing-package.service';
import { PricingPackageController } from './pricing-package.controller';
import { PricingPackage, PricingPackageSchema } from './entities/pricing-package.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PricingPackage.name, schema: PricingPackageSchema },
    ]),
  ],
  controllers: [PricingPackageController],
  providers: [PricingPackageService],
  exports: [PricingPackageService],
})
export class PricingPackageModule {}