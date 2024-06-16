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
    if (!rentABike.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "something went wrong to rent a bike,try again",
      );
    }

    const bikeInfo = await Bike.findByIdAndUpdate(
      bikeId,
      { isAvailable: false },
      { new: true, session },
    );
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
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Something went wrong to rent a bike",
    );
  }
};

const myRentalsService = async (payload: JwtPayload) => {
  const { email } = payload;
  const user = await User.findOne({ email });
  const userId = user?._id;
  const result = await Booking.find({ userId });

  return result;
};

const returnBikeServices = async (bookingId: string) => {
  const bookingInformation = await Booking.findById(bookingId);
  if (!bookingInformation) {
    throw new AppError(httpStatus.FORBIDDEN, "Sorry there is no such booking");
  }
  const bikeId = bookingInformation.bikeId;

  const bikeInformation = await Bike.findById(bikeId);

  // INFO: start  time ke bangladesh time e rupantor
  const startTime = bookingInformation.startTime;
  const returnTIme = new Date().toISOString();

  const pricePerHourOfABike = bikeInformation?.pricePerHour as number;

  let totalHours = 0;
  if (startTime && returnTIme) {
    const withoutCeil = (new Date(returnTIme).getTime()) - startTime.getTime();
    const withoutCeilInHours = withoutCeil / (1000 * 60 * 60);
    totalHours = Math.ceil(withoutCeilInHours);
  }

  const totalCost = pricePerHourOfABike * totalHours;
  const bookingUpdatedInformation: Partial<IBooking> = {};


  bookingUpdatedInformation.returnTime = new Date(returnTIme);
  bookingUpdatedInformation.totalCost = totalCost;
  bookingUpdatedInformation.isReturned = true;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const updateBooking = await Booking.findByIdAndUpdate(
      bookingId,
      bookingUpdatedInformation,
      { new: true, session },
    );
    if (!updateBooking) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Something went wrong to update the booking information ",
      );
    }
    const updateBike = await Bike.findByIdAndUpdate(
      bikeId,
      { isAvailable: true },
      { new: true, session },
    );
    if (!updateBike) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Something went wrong to update the bike information",
      );
    }
    await session.commitTransaction();
    await session.endSession();

    return updateBooking;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.FORBIDDEN, "Something went wrong to update ");
  }
};

export const BookingServices = {
  myRentalsService,
  rentABikeService,
  returnBikeServices,
};
