import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.enableCors(corsOptions);

  app.useGlobalFilters(
  new AllExceptionsFilter(configService),  // configService pass karo
  new HttpExceptionFilter(),
);
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      stopAtFirstError: false, // sab errors ek saath dekho
      transformOptions: {
        enableImplicitConversion: true, // <-- ye missing tha
      },
      exceptionFactory: (errors) => {
        // nested errors bhi flatten karo
        const flatten = (errs: any[], parent = ''): any[] =>
          errs.flatMap((e) => {
            const field = parent ? `${parent}.${e.property}` : e.property;
            const children = e.children?.length
              ? flatten(e.children, field)
              : [];
            const constraints = e.constraints
              ? [{ field, errors: Object.values(e.constraints) }]
              : [];
            return [...constraints, ...children];
          });

        const messages = flatten(errors);
        console.error('❌ Validation Errors:', JSON.stringify(messages, null, 2));

        return new BadRequestException({
          message: 'Validation failed',
          errors: messages,
        });
      },
    }),
  );

  app.setGlobalPrefix('api');

  const port = Number(configService.get<string>('PORT')) || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`Environment: ${configService.get<string>('NODE_ENV', 'development')}`);
}
bootstrap();