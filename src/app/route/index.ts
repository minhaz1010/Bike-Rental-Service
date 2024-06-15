import e from "express";
import { BikeRoutes } from "../module/bike/bike.route";
import { UserRoutes } from "../module/user/user.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { BookingRoutes } from "../module/booking/booking.route";

const router = e.Router();

const moduleRouter = [
  {
    path: "/",
    route: BikeRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/rentals",
    route: BookingRoutes,
  },
];

moduleRouter.forEach((route) => {
  router.use(route.path, route.route);
});

export const mainRoutes = router;
