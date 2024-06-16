import e from "express";
import validateRequest from "../../middleware/validateRequest";
import { BookingValidations } from "./booking.validation";
import { BookingController } from "./booking.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = e.Router();

router.post(
  "/",
  validateRequest(BookingValidations.createRentalBikeValidation),
  BookingController.boookingABike,
);
router.get("/", BookingController.myRentals);

router.put(
  "/:id/return",
  authMiddleware("admin"),
  BookingController.returnBike,
);

export const BookingRoutes = router;
