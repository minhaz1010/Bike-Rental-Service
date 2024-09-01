import e from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidations } from "./user.validation";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = e.Router();

router.get("/me", UserController.seeUserProfile);

router.get(
  "/all-users",
  authMiddleware("admin"),
  UserController.getAllUsers,
);

router.patch(
  "/update-user-role",
  authMiddleware("admin"),
  UserController.updateUserRole,
);

router.delete(
  "/delete-a-user",
  authMiddleware("admin"),
  UserController.deleteAUser,
);

router.put(
  "/me",
  validateRequest(UserValidations.updateUserValidationSchema),
  UserController.updateUserProfile,
);

export const UserRoutes = router;
