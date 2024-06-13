import { Query, Schema, model } from "mongoose";
import { IBike } from "./bike.interface";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

const bikeSchema = new Schema<IBike>({
  name: {
    type: String,
    required: [true, "Your name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  pricePerHour: {
    type: Number,
    required: [true, "price per hour  is required"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  cc: {
    type: Number,
    required: [true, "Bike CC is required"],
  },
  year: {
    type: Number,
    required: [true, "Bike release year is required"],
  },
  model: {
    type: String,
    required: [true, "Bike model is required"],
  },
  brand: {
    type: String,
    required: [true, "Bike brand is required"],
  },
});


bikeSchema.pre<Query<any, any>>(/^findOneAnd(Update|Delete)$/, async function(next) {
  const query = this as Query<any, any>;
  const _id = query.getQuery()._id;

  const bike = await Bike.findById(_id).session(null);


  if (!bike) {
    return next(new AppError(httpStatus.NOT_FOUND, "No data found"));
  }

  next();
});



// bikeSchema.pre<Query<any, any>>("findOneAndUpdate", async function(next) {
//   const { _id } = this.getQuery();
//
//   const checkExistOrNot = await Bike.findById(_id);
//
//   if (!checkExistOrNot) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       "Sorry there is no such bike to update",
//     );
//   }
//
//   next();
// });
//
// bikeSchema.pre<Query<any, any>>("findOneAndDelete", async function(next) {
//   const { _id } = this.getQuery();
//   const checkExistOrNot = await Bike.findById(_id);
//   if (!checkExistOrNot) {
//     throw new AppError(httpStatus.NOT_FOUND, "Sorry there is no such product")
//   }
//   next();
// })





export const Bike = model<IBike>("Bike", bikeSchema);
