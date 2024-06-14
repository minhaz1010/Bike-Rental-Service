import e from "express";
import { BikeRoutes } from "../module/bike/bike.route";
import { UserRoutes } from "../module/user/user.route";

const router = e.Router();

const moduleRouter = [
  {
    path: "/",
    route: BikeRoutes,
  },
  {
    path: "/",
    route: UserRoutes
  }
];

moduleRouter.forEach((route) => {
  router.use(route.path, route.route);
});

export const mainRoutes = router;
