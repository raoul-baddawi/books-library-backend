import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { transformObject } from "$/utils/misc";

@Injectable()
export class TransformInterceptor<T extends object | object[], U extends object>
  implements NestInterceptor<T, T extends Array<unknown> ? U[] : U>
{
  private readonly transformer: Parameters<typeof transformObject<T, U>>[1];

  constructor(transformer: Parameters<typeof transformObject<T, U>>[1]) {
    this.transformer = transformer;
  }

  intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<T extends Array<unknown> ? U[] : U> {
    return next
      .handle()
      .pipe(map((data) => transformObject<T, U>(data as T, this.transformer)));
  }
}
