import type { Response } from "express";
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

export const getS3Url = (photo?: string) => {
  if (!photo) return "";
  if (photo?.includes("http")) {
    return photo;
  }
  return `${process.env.S3_BASE_URL}/${photo}`;
};

export const fullNameReturner = (firstName?: string, lastName?: string) => {
  let name = "";
  if (firstName) name += firstName;
  if (lastName) name += ` ${lastName}`;
  return name.trim();
};

export const responseTokenCookie = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: Response<any, Record<string, any>>,
  token?: string,
  // Default expiry: 24 hours
  expires = new Date(Date.now() + 1000 * 60 * 60 * 24)
) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    expires
  });
};
