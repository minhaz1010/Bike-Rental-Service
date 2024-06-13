import { Schema, model } from "mongoose";
import { IBike } from "./bike.interface";

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

export const Bike = model<IBike>("Bike", bikeSchema);
