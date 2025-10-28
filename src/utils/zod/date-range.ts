import z from "zod";
import { dateSchema } from "./date-schema";

export const dateRangeSchema = z.strictObject({
  startDate: dateSchema,
  endDate: dateSchema
});
