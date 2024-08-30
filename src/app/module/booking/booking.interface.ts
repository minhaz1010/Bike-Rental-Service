import { Types } from "mongoose";

export interface IBooking {
  userId: Types.ObjectId;
  bikeId: Types.ObjectId;
  bookingStatus: "INITIAL_PAID" | "FULL_PAID" | "CANCEL";
  transactionId: string;
  startTime: Date;
  returnTime: Date;
  totalCost: number;
  isReturned: boolean;
}
