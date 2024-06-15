import e from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidations } from "./user.validation";

const router = e.Router();

router.get("/me", UserController.seeUserProfile);

router.put(
  "/me",
  validateRequest(UserValidations.updateUserValidationSchema),
  UserController.updateUserProfile,
);

export const UserRoutes = router;
