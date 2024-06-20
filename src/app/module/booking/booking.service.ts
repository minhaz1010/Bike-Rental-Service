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
  // * find the logged in user
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, "No user found");
  }
  
  // * get the bikeId and startTime 
  const { bikeId, startTime } = bookingData;

  // * finding the bike by bikeId
  const bike = await Bike.findById(bikeId);
  // * if there is no bike then no bike found will send
  if (!bike) {
    throw new AppError(httpStatus.BAD_REQUEST, "No bike found");
  }
  // * check if the bike is Available or not 
  const isBikeAvailable = bike.isAvailable;

  if (!isBikeAvailable) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bike is unavailable");
  }
 
  // * add Bookinginfo and then saved it into the booking model
  const bookingInfo: Partial<IBooking> = {};
  bookingInfo.bikeId = bikeId;
  bookingInfo.userId = user._id;
  bookingInfo.startTime = startTime;
  // * start the mongoose session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const rentABike = await Booking.create([bookingInfo], { session });
    // * if anything happens to create the rent then error will be thrown
    if (!rentABike.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "something went wrong to rent a bike,try again",
      );
    }

    // * update the bike isAvailability
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

// * see my rental bike
const myRentalsService = async (payload: JwtPayload) => {
  const { email } = payload;
  const user = await User.findOne({ email });
  const userId = user?._id;
  const result = await Booking.find({ userId });

  return result;
};


// * return bike services (admin)
const returnBikeServices = async (bookingId: string) => {

  // * get the bookingInformation
  const bookingInformation = await Booking.findById(bookingId);
  if (!bookingInformation) {
    throw new AppError(httpStatus.FORBIDDEN, "Sorry there is no such booking");
  }
   // * if the bike is already returned then show it to the client
  if (bookingInformation.isReturned === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'The bike is already returned')
  }
  // * getting the bikeId from bookingInformation
  const bikeId = bookingInformation.bikeId;
 // * getting the bike information 
  const bikeInformation = await Bike.findById(bikeId);

  const startTime = bookingInformation.startTime; // * startTime from booking model
  const returnTIme = new Date().toISOString(); // * return time when route is getting hit

  const pricePerHourOfABike = bikeInformation?.pricePerHour as number; // * pricePerHour

  let totalHours = 0;
  // * calculating totalHours
  if (startTime && returnTIme) {
    const withoutCeil = (new Date(returnTIme).getTime()) - startTime.getTime();
    const withoutCeilInHours = withoutCeil / (1000 * 60 * 60);
    totalHours = Math.ceil(withoutCeilInHours); // * if someone run the bike for 1.5 hour then make it to the 2 hours that what happens in the real world
  }

  // * calculating total cost
  const totalCost = Math.abs(pricePerHourOfABike * totalHours);
  // * update the booking information
  const bookingUpdatedInformation: Partial<IBooking> = {};
  bookingUpdatedInformation.returnTime = new Date(returnTIme);
  bookingUpdatedInformation.totalCost = totalCost;
  bookingUpdatedInformation.isReturned = true;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // * update the booking info such as return time total cost and isReturned field
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
    // * update the bike isAvailable false to true
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
