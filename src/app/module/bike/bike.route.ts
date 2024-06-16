import e from "express";
import { BikeController } from "./bike.controller";
import validateRequest from "../../middleware/validateRequest";
import { BikeValidations } from "./bike.validation";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = e.Router();

router.post(
  "/bikes",
  authMiddleware("admin"),
  validateRequest(BikeValidations.createBikeValidationSchema),
  BikeController.createBike,
);
router.get("/bikes", BikeController.getAllBike);

router.put(
  "/bikes/:id",
  authMiddleware("admin"),
  validateRequest(BikeValidations.updateBikeValidationSchema),
  BikeController.updateBike,
);

router.delete("/bikes/:id", authMiddleware('admin'), BikeController.deleteBike);

export const BikeRoutes = router;
