import e from "express";
import { BikeRoutes } from "../module/bike/bike.route";

const router = e.Router();

const moduleRouter = [
  {
    path: "/",
    route: BikeRoutes,
  },
];

moduleRouter.forEach((route) => {
  router.use(route.path, route.route);
});

export const mainRoutes = router;
