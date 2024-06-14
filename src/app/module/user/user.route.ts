import e from "express";
import { UserControllers } from "./user.controller";

const router = e.Router();

router.post("/auth/signup", UserControllers.createUser);

export const UserRoutes = router;
