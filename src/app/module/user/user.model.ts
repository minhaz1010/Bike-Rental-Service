import { Schema, UpdateQuery, model } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from "bcrypt";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const value = this.getUpdate() as UpdateQuery<any>;

  if (value) {
    if (value.password) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can not update the password",
      );
    }
  }

  next();
});

export const User = model<IUser>("User", userSchema);
