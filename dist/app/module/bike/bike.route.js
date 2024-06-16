"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BikeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bike_controller_1 = require("./bike.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const bike_validation_1 = require("./bike.validation");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/bikes", (0, authMiddleware_1.authMiddleware)("admin"), (0, validateRequest_1.default)(bike_validation_1.BikeValidations.createBikeValidationSchema), bike_controller_1.BikeController.createBike);
router.get("/bikes", bike_controller_1.BikeController.getAllBike);
router.put("/bikes/:id", (0, authMiddleware_1.authMiddleware)("admin"), (0, validateRequest_1.default)(bike_validation_1.BikeValidations.updateBikeValidationSchema), bike_controller_1.BikeController.updateBike);
router.delete("/bikes/:id", (0, authMiddleware_1.authMiddleware)('admin'), bike_controller_1.BikeController.deleteBike);
exports.BikeRoutes = router;
