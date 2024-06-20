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
    throw new AppError(httpStatus.BAD_REQUEST, "No user found ");
  }
  // * checking password is correct or not
  const check = await checkPasswordIsCorrectOrNot(
    payload?.password,
    user?.password,
  );
  // * checking password is correct or not
  if (check === false) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your password is wrong");
  }
  // * if everything is ok then create a jwtpayload
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };



  const userObj: Partial<IUser> = user.toObject();
  delete userObj['password'];

   // * create a token
  const token = jwt.sign(jwtPayload, config.JWT_SECRET as string, {
    expiresIn: config.JWT_EXPIRES,
  });
  // * return the user without password and jwt token
  return {
    userObj,
    token,
  };
};

const signUpAUserService = async (payload: IUser) => {
  const user = new User(payload);
  await user.save();

   // * copy the user in userObj and then delete the password
  const userObj: Partial<IUser> = user.toObject();
  // delete userObj['password']
  delete userObj.password

  

  // * return the user without password
  return userObj;
};

export const AuthServices = {
  loginService,
  signUpAUserService,
};
