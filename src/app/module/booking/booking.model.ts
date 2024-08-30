import { Schema, model } from "mongoose";
import { IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  bikeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Bike",
  },
  bookingStatus: {
    type: String,
    enum: ["INITIAL_PAID", "FULL_PAID", "CANCEL"],
    default: "CANCEL",
  },
  transactionId: {
    type: String,
  },
  startTime: {
    type: Date,
    required: true,
  },
  returnTime: {
    type: Date,
    default: null,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
});

export const Booking = model<IBooking>("Booking", bookingSchema);
