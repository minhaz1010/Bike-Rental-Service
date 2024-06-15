import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { User } from "../user/user.model";
import { IAuth } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";
import { IUser } from "../user/user.interface";
import checkPasswordIsCorrectOrNot from "../../utils/comparePassword";

const loginService = async (payload: IAuth) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "No user found with this email");
  }

  const check = await checkPasswordIsCorrectOrNot(
    payload.password,
    user.password,
  );
  if (check === false) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your password is wrong");
  }
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  const userObj = user.toObject();
  delete userObj.password;

  const token = jwt.sign(jwtPayload, config.JWT_SECRET as string, {
    expiresIn: config.JWT_EXPIRES,
  });
  return {
    userObj,
    token,
  };
};

const signUpAUserService = async (payload: IUser) => {
  const user = new User(payload);
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const AuthServices = {
  loginService,
  signUpAUserService,
};
