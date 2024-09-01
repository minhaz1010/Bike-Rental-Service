import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import { Bike } from "../bike/bike.model";
import mongoose from "mongoose";
import { Booking } from "./booking.model";
import { JwtPayload } from "jsonwebtoken";
import { finalPayment, initiatePayment } from "../../utils/bookingUtils";
import { TSendinfo } from "../../utils";
import { IUser } from "../user/user.interface";

// & rent a bike service
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
  const transId = `TXN-${Date.now()}-${Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111}`;
  const bookingInfo: Partial<IBooking> = {};
  bookingInfo.bikeId = bikeId;
  bookingInfo.userId = user._id;
  bookingInfo.startTime = startTime;
  bookingInfo.transactionId = transId;

  const rentABike = await Booking.create(bookingInfo);
  // * if anything happens to create the rent then error will be thrown
  if (!rentABike) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "something went wrong to rent a bike,try again",
    );
  }

  const sendInfo: TSendinfo = {
    customerName: user.name,
    customerEmail: user.email,
    customerAddress: user.address,
    customerPhone: user.phone,
    totalPrice: bike.pricePerHour,
    transactionId: transId,
  };
  const response = await initiatePayment(sendInfo);
  return response?.payment_url;
};
// & full payment
const fullPaymentService = async (bookingId: string) => {
  const bookingInfo = await Booking.findById(bookingId);
  if (bookingInfo?.bookingStatus === "FULL_PAID") {
    throw new AppError(httpStatus.FORBIDDEN, "Already Paid");
  }

  const userId = bookingInfo?.userId;
  const userInfo = (await User.findById(userId)) as IUser;

  const finalTransactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111}`;
  const sendInfo: TSendinfo = {
    customerName: userInfo.name,
    customerEmail: userInfo.email,
    customerAddress: userInfo.address,
    customerPhone: userInfo.phone,
    totalPrice: bookingInfo?.totalCost as number,
    transactionId: finalTransactionId,
  };

  await Booking.findByIdAndUpdate(
    bookingId,
    {
      finalTransactionId: finalTransactionId,
    },
    {
      new: true,
    },
  );

  const response = await finalPayment(sendInfo);

  return response?.payment_url;
};

// & see my rental bike
const myRentalsService = async (payload: JwtPayload) => {
  const { email } = payload;
  const user = await User.findOne({ email });
  const userId = user?._id;
  const result = await Booking.find({
    userId: userId,
    bookingStatus: { $ne: "CANCEL" },
  }).populate({
    path: "bikeId",
    select: "name",
  });

  return result;
};

// & return bike services (admin)
// const returnBikeServices = async (bookingId: string,returnTime:string) => {
//   // * get the bookingInformation
//   const bookingInformation = await Booking.findById(bookingId);
//   if (!bookingInformation) {
//     throw new AppError(httpStatus.FORBIDDEN, "Sorry there is no such booking");
//   }
//   // * if the bike is already returned then show it to the client
//   if (bookingInformation.isReturned === true) {
//     throw new AppError(httpStatus.FORBIDDEN, "The bike is already returned");
//   }
//   // * getting the bikeId from bookingInformation
//   const bikeId = bookingInformation.bikeId;
//   // * getting the bike information
//   const bikeInformation = await Bike.findById(bikeId);

//   const startTime = bookingInformation.startTime; // * startTime from booking model
//   const returnTIme = new Date().toISOString(); // * return time when route is getting hit

//   console.log(startTime,'start time');
//   console.log(returnTime,'return time from body');

//   const pricePerHourOfABike = bikeInformation?.pricePerHour as number; // * pricePerHour

//   let totalHours = 0;
//   // * calculating totalHours
//   if (startTime && returnTIme) {
//     const withoutCeil = new Date(returnTIme).getTime() - startTime.getTime();
//     const withoutCeilInHours = withoutCeil / (1000 * 60 * 60);
//     totalHours = Math.ceil(withoutCeilInHours); // * if someone run the bike for 1.5 hour then make it to the 2 hours that what happens in the real world
//   }

//   // * calculating total cost
//   const totalCost = Math.abs(pricePerHourOfABike * totalHours);
//   console.log(totalCost,'total cost');
//   // * update the booking information
//   const bookingUpdatedInformation: Partial<IBooking> = {};
//   bookingUpdatedInformation.returnTime = new Date(returnTIme);
//   bookingUpdatedInformation.totalCost = totalCost;
//   bookingUpdatedInformation.isReturned = true;

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();
//     // * update the booking info such as return time total cost and isReturned field
//     const updateBooking = await Booking.findByIdAndUpdate(
//       bookingId,
//       bookingUpdatedInformation,
//       { new: true, session },
//     );
//     if (!updateBooking) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         "Something went wrong to update the booking information ",
//       );
//     }
//     // * update the bike isAvailable false to true
//     const updateBike = await Bike.findByIdAndUpdate(
//       bikeId,
//       { isAvailable: true },
//       { new: true, session },
//     );
//     if (!updateBike) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         "Something went wrong to update the bike information",
//       );
//     }
//     await session.commitTransaction();
//     await session.endSession();

//     return updateBooking;
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(httpStatus.FORBIDDEN, "Something went wrong to update ");
//   }
// };

const calculateTotalAmount = async (bookingId: string, returnTime: string) => {
  const bookingInfo = await Booking.findById(bookingId);
  if (!bookingInfo) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Sorry there is no such booking",
    );
  }

  if (bookingInfo.isReturned === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "The Bike Is Already Returned");
  }

  const bikeId = bookingInfo.bikeId;

  const startTime = bookingInfo.startTime;

  const dateStartTime = new Date(startTime);

  const dateReturnTime = new Date(returnTime);
  const timeDiffInMS = dateReturnTime.getTime() - dateStartTime.getTime();
  const totalHours = timeDiffInMS / (1000 * 60 * 60);
  const bikeInfo = await Bike.findById(bikeId);

  const pricePerHour = bikeInfo?.pricePerHour as number;

  const totalPayment = Math.ceil((totalHours * pricePerHour) as number);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updateBookingInfo = await Booking.findByIdAndUpdate(
      bookingId,
      {
        totalCost: totalPayment,
        returnTime: returnTime,
      },
      {
        new: true,
        session,
      },
    );
    if (!updateBookingInfo) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Some Error Occured to update the Booking Information",
      );
    }
    const updatedBikeInfo = await Bike.findByIdAndUpdate(
      bikeId,
      {
        isAvailable: true,
      },
      {
        new: true,
        session,
      },
    );
    if (!updatedBikeInfo) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Some Error Occured to update the Bike Information",
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return updateBookingInfo;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Some Error Occured to update both information",
    );
  }
};

const seeAllRentalService = async () => {
  const result = await Booking.find({
    bookingStatus: { $ne: "CANCEL" },
  }).populate({
    path: "bikeId",
    select: "_id name imageUrl",
  });
  return result;
};

export const BookingServices = {
  myRentalsService,
  rentABikeService,
  fullPaymentService,
  calculateTotalAmount,
  seeAllRentalService,
};
