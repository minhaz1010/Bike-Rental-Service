import e from "express";
import validateRequest from "../../middleware/validateRequest";
import { BookingValidations } from "./booking.validation";
import { BookingController } from "./booking.controller";

const router = e.Router();

router.post(
  "/",
  validateRequest(BookingValidations.createRentalBikeValidation),
  BookingController.boookingABike,
);

export const BookingRoutes = router;
