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


const updateBikeValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    pricePerHour: z.number().optional(),
    isAvailable: z.boolean().default(true).optional(),
    cc: z.number().optional(),
    year: z.number().optional(),
    model: z.string().optional(),
    brand: z.string().optional(),
  })
})
export const BikeValidations = {
  createBikeValidationSchema,
  updateBikeValidationSchema,
};
