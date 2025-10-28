import z from "zod";

export const dateSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
  .transform((val) => new Date(val));

export const rawDateSchema = z.date();
