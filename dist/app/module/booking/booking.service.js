"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const user_model_1 = require("../user/user.model");
const bike_model_1 = require("../bike/bike.model");
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = require("./booking.model");
const rentABikeService = (payload, bookingData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "No user found");
    }
    const { bikeId, startTime } = bookingData;
    const bike = yield bike_model_1.Bike.findById(bikeId);
    if (!bike) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No bike found");
    }
    const isBikeAvailable = bike.isAvailable;
    if (!isBikeAvailable) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Bike is unavailable");
    }
    const bookingInfo = {};
    bookingInfo.bikeId = bikeId;
    bookingInfo.userId = user._id;
    bookingInfo.startTime = startTime;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const rentABike = yield booking_model_1.Booking.create([bookingInfo], { session });
        if (!rentABike.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "something went wrong to rent a bike,try again");
        }
        const bikeInfo = yield bike_model_1.Bike.findByIdAndUpdate(bikeId, { isAvailable: false }, { new: true, session });
        if (!bikeInfo) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Something went wrong to update bike");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return rentABike;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Something went wrong to rent a bike");
    }
});
const myRentalsService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    const user = yield user_model_1.User.findOne({ email });
    const userId = user === null || user === void 0 ? void 0 : user._id;
    const result = yield booking_model_1.Booking.find({ userId });
    return result;
});
const returnBikeServices = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingInformation = yield booking_model_1.Booking.findById(bookingId);
    if (!bookingInformation) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Sorry there is no such booking");
    }
    if (bookingInformation.isReturned === true) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'The bike is already returned');
    }
    const bikeId = bookingInformation.bikeId;
    const bikeInformation = yield bike_model_1.Bike.findById(bikeId);
    const startTime = bookingInformation.startTime;
    const returnTIme = new Date().toISOString();
    const pricePerHourOfABike = bikeInformation === null || bikeInformation === void 0 ? void 0 : bikeInformation.pricePerHour;
    let totalHours = 0;
    if (startTime && returnTIme) {
        const withoutCeil = (new Date(returnTIme).getTime()) - startTime.getTime();
        const withoutCeilInHours = withoutCeil / (1000 * 60 * 60);
        totalHours = Math.ceil(withoutCeilInHours);
    }
    const totalCost = Math.abs(pricePerHourOfABike * totalHours);
    const bookingUpdatedInformation = {};
    bookingUpdatedInformation.returnTime = new Date(returnTIme);
    bookingUpdatedInformation.totalCost = totalCost;
    bookingUpdatedInformation.isReturned = true;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const updateBooking = yield booking_model_1.Booking.findByIdAndUpdate(bookingId, bookingUpdatedInformation, { new: true, session });
        if (!updateBooking) {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, "Something went wrong to update the booking information ");
        }
        const updateBike = yield bike_model_1.Bike.findByIdAndUpdate(bikeId, { isAvailable: true }, { new: true, session });
        if (!updateBike) {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, "Something went wrong to update the bike information");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return updateBooking;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Something went wrong to update ");
    }
});
exports.BookingServices = {
    myRentalsService,
    rentABikeService,
    returnBikeServices,
};
