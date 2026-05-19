import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { PackageModule } from './modules/package/package.module';
import { MailModule } from './shared/mail/mail.module';
import { InquiryModule } from './modules/inquiry/inquiry.module';
import { HajjInquiryModule } from './modules/hajj-inquiry/hajj-inquiry.module';
import { ShiftingHajjPackageModule } from './modules/shifting-hajj-package/shifting-hajj-package.module';
import { NonShiftingHajjPackageModule } from './modules/non-shifting-hajj-package/non-shifting-hajj-package.module';
import { UmrahPackagesModule } from './modules/umrah-package/umrah-package.module';
import { GroupFamilyPackagesModule } from './modules/group-family-package/group-family-package.module';
import { PricingPackageModule } from './modules/pricing-package/pricing-package.module';
import { MonthlyUmrahPackagesModule } from './modules/monthly-umrah-package/monthly-umrah-package.module';
import { AshraPackagesModule } from './modules/ashra-packages/ashra-packages.module';
import { SpecialPackagesModule } from './modules/special-packages/special-packages.module';
import { FlightDealsModule } from './modules/flight-deal/flight-deal.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    UserModule,
    CloudinaryModule,
    PackageModule,
    MailModule,
    InquiryModule,
    HajjInquiryModule,
    ShiftingHajjPackageModule,
    NonShiftingHajjPackageModule,
    UmrahPackagesModule,
    GroupFamilyPackagesModule,
    PricingPackageModule,
    MonthlyUmrahPackagesModule,
    AshraPackagesModule,
    SpecialPackagesModule,
    FlightDealsModule,
    ContactModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}