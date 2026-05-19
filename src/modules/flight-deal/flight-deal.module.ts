// flight-deals.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlightDeal, FlightDealSchema } from './entities/flight-deal.entity';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { FlightDealsController } from './flight-deal.controller';
import { FlightDealsService } from './flight-deal.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlightDeal.name, schema: FlightDealSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [FlightDealsController],
  providers: [FlightDealsService],
  exports: [FlightDealsService],
})
export class FlightDealsModule {}