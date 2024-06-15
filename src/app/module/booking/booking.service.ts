import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import { Bike } from "../bike/bike.model";
import mongoose from "mongoose";
import { Booking } from "./booking.model";
import { JwtPayload } from "jsonwebtoken";

const rentABikeService = async (
  payload: JwtPayload,
  bookingData: Partial<IBooking>,
) => {
  const { email } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, "No user found");
  }

  const { bikeId, startTime } = bookingData;

  const bike = await Bike.findById(bikeId);
  if (!bike) {
    throw new AppError(httpStatus.BAD_REQUEST, "No bike found");
  }
  const isBikeAvailable = bike.isAvailable;

  if (!isBikeAvailable) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bike is unavailable");
  }

  const bookingInfo: Partial<IBooking> = {};
  bookingInfo.bikeId = bikeId;
  bookingInfo.userId = user._id;
  bookingInfo.startTime = startTime;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const rentABike = await Booking.create([bookingInfo], { session });
    console.log({ rentABike });
    if (!rentABike.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "something went wrong to rent a bike,try again",
      );
    }

    const bikeInfo = await Bike.findByIdAndUpdate(
      bikeId,
      { isAvailable: false },
      { new: true },
    );
    console.log({ bikeInfo });
    if (!bikeInfo) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Something went wrong to update bike",
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return rentABike;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.log({ error }, "booking controller");
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Something went wrong to rent a bike",
    );
  }
};

export const BookingServices = {
  rentABikeService,
};
