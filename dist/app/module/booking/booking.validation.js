"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidations = void 0;
const zod_1 = require("zod");
const createRentalBikeValidation = zod_1.z.object({
    body: zod_1.z.object({
        bikeId: zod_1.z.string({ required_error: "Bike id is required" }),
        startTime: zod_1.z.string().datetime(),
    }),
});
exports.BookingValidations = {
    createRentalBikeValidation,
};
