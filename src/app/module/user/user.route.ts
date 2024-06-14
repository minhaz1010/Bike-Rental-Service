import e from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidations } from "./user.validation";
import { AuthValidations } from "../auth/auth.validation";
import { AuthControllers } from "../auth/auth.controller";

const router = e.Router();

router.post(
  "/auth/signup",
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

router.post("/auth/login", validateRequest(AuthValidations.loginAuth), AuthControllers.login);

export const UserRoutes = router;
