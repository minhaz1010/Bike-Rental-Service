import { JwtPayload } from "jsonwebtoken";
import { User } from "./user.model";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import { IUser } from "./user.interface";

const seeProfileServices = async (payload: JwtPayload) => {
  const email = payload?.email;
  const result = await User.findOne({ email }).select("-password");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "No user found");
  }
  return result;
};

const updateProfileServices = async (
  payload: JwtPayload,
  userData: Partial<IUser>,
) => {
  const email = payload?.email;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "No user found");
  }
  const result = await User.findOneAndUpdate({ email }, userData, {
    new: true,
  }).select("-password");
  return result;
};

export const UserServices = {
  seeProfileServices,
  updateProfileServices,
};
