import { z } from "zod";

const createBikeValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    pricePerHour: z.number(),
    isAvailable: z.boolean().default(true).optional(),
    cc: z.number(),
    year: z.number(),
    model: z.string(),
    brand: z.string(),
  }),
});

export const BikeValidations = {
  createBikeValidationSchema,
};
