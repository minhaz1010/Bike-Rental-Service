"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bike_route_1 = require("../module/bike/bike.route");
const user_route_1 = require("../module/user/user.route");
const auth_route_1 = require("../module/auth/auth.route");
const booking_route_1 = require("../module/booking/booking.route");
const router = express_1.default.Router();
const moduleRouter = [
    {
        path: "/",
        route: bike_route_1.BikeRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/rentals",
        route: booking_route_1.BookingRoutes,
    },
];
moduleRouter.forEach((route) => {
    router.use(route.path, route.route);
});
exports.mainRoutes = router;
