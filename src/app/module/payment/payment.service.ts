import mongoose from "mongoose";
import { Bike } from "../bike/bike.model";
import { Booking } from "../booking/booking.model";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import path from "path";
import { readFileSync } from "fs";

const confirmPaymentService = async (trxId: string, amount: number) => {
  const filePath = path.join(__dirname, "../../views/confirmation.html");
  let template = readFileSync(filePath, "utf-8");
  if (amount === 100) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      // ! update the paymentStatus to initial_paid
      const updatedBookingData = await Booking.findOneAndUpdate(
        {
          transactionId: trxId,
        },
        {
          bookingStatus: "INITIAL_PAID",
        },
        {
          new: true,
          session,
        },
      );

      if (!updatedBookingData) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Something Went Wrong to update the booking status",
        );
      }

      const bikeId = updatedBookingData.bikeId;

      // ! update the isAvailibility to false in Bike Model

      const updatedBikeInfo = await Bike.findByIdAndUpdate(
        bikeId,
        {
          isAvailable: false,
        },
        {
          new: true,
          session,
        },
      );

      if (!updatedBikeInfo) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Something Went Wrong to update the bike availibility",
        );
      }

      await session.commitTransaction();
      await session.endSession();
      template = template.replace(
        "{transactionId}",
        updatedBookingData.transactionId,
      );

      return template;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Something Went wrong to update booking and bike status",
      );
    }
  }
};

const finalConfirmPaymentService = async (trxId: string) => {
  const filePath = path.join(__dirname, "../../views/confirmation.html");
  let template = readFileSync(filePath, "utf-8");
  console.log(trxId, "transaction id");
  // ! update the paymentStatus to full_paid
  const updatedBookingData = await Booking.findOneAndUpdate(
    {
      finalTransactionId: trxId,
    },
    {
      bookingStatus: "FULL_PAID",
    },
    {
      new: true,
    },
  );
  console.log(updatedBookingData, "from final pyment service");
  // if (!updatedBookingData) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "Something Went Wrong to update the booking status",
  //   );
  // }

  template = template.replace(
    "{transactionId}",
    updatedBookingData.transactionId,
  );

  return template;
};

export const PaymentServices = {
  confirmPaymentService,
  finalConfirmPaymentService,
};
