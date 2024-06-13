import e from "express";
import { BikeController } from "./bike.controller";
import validateRequest from "../../middleware/validateRequest";
import { BikeValidations } from "./bike.validation";

const router = e.Router();

router.post(
  "/bikes",
  validateRequest(BikeValidations.createBikeValidationSchema),
  BikeController.createBike,
);
router.get("/bikes", BikeController.getAllBike)

export const BikeRoutes = router;
