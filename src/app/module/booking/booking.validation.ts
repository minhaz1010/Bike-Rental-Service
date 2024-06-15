import { z } from "zod";

const createRentalBikeValidation = z.object({
  body: z.object({
    bikeId: z.string({ required_error: "Bike id is required" }),
    startTime: z.string().datetime(),
  }),
});

export const BookingValidations = {
  createRentalBikeValidation,
};
