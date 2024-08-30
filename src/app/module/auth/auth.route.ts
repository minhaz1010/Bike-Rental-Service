import e from "express";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidations } from "../user/user.validation";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = e.Router();

router.post(
  "/signup",
  validateRequest(UserValidations.createUserValidationSchema),
  AuthControllers.signUp,
);
router.post(
  "/login",
  validateRequest(AuthValidations.loginAuth),
  AuthControllers.login,
);

router.put(
  "/change-password",
  validateRequest(AuthValidations.changePasswordValidation),
  authMiddleware("admin", "user"),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
