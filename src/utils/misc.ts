import { z } from "zod";

export function transformObject<T extends object | object[], U extends object>(
  input: T,
  transformer: (data: T extends Array<infer TArr> ? TArr : T) => U
): T extends Array<unknown> ? U[] : U {
  if (Array.isArray(input)) {
    return input.map(
      (val) => z.any().transform(transformer).safeParse(val).data
    ) as T extends unknown[] ? U[] : U;
  }

  return z.any().transform(transformer).safeParse(input)
    .data as T extends unknown[] ? U[] : U;
}
