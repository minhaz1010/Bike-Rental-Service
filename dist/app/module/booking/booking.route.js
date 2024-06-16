"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const booking_validation_1 = require("./booking.validation");
const booking_controller_1 = require("./booking.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.default)(booking_validation_1.BookingValidations.createRentalBikeValidation), booking_controller_1.BookingController.boookingABike);
router.get("/", booking_controller_1.BookingController.myRentals);
router.put("/:id/return", (0, authMiddleware_1.authMiddleware)("admin"), booking_controller_1.BookingController.returnBike);
exports.BookingRoutes = router;
