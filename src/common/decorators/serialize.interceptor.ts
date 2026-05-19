import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: unknown[]): object;
}

export function SerializeResponse(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    return next.handle().pipe(
      map((response: any) => {
        // Agar { success, message, data } wrapper hai
        if (response && typeof response === 'object' && 'data' in response) {
          const serializedData = Array.isArray(response.data)
            ? response.data.map((item: any) =>
                plainToInstance(this.dto, item, { excludeExtraneousValues: true })
              )
            : plainToInstance(this.dto, response.data, { excludeExtraneousValues: true });

          return { ...response, data: serializedData };
        }

        // Purana logic — direct object
        return plainToInstance(this.dto, response, { excludeExtraneousValues: true });
      }),
    );
  }
}