import { UseInterceptors } from "@nestjs/common";

import type { transformObject } from "$/utils/misc";

import { TransformInterceptor } from "../interceptors/transform.interceptor";

export function TransformResponse<
  T extends object | object[],
  U extends object
>(transformer: Parameters<typeof transformObject<T, U>>[1]) {
  return UseInterceptors(new TransformInterceptor<T, U>(transformer));
}
