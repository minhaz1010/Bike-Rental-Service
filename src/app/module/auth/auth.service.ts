import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { User } from "../user/user.model";
import { IAuth } from "./auth.interface";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const checkPasswordIsCorrectOrNot = async (payloadPassword, userPassword) => {
  return await bcrypt.compare(payloadPassword, userPassword);
}

const loginService = async (payload: IAuth) => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No user found with this email');
  }

  const check = await checkPasswordIsCorrectOrNot(payload.password, user.password);
  if (check === false) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Your password is wrong')
  }
  const jwtPayload = {
    email: user.email,
    role: user.role
  }
  const userObj = user.toObject();
  delete userObj.password;


  console.log({ userObj }, 'userObj');


  const token = jwt.sign(jwtPayload, 'this is test token', {
    expiresIn: '30d'
  });
  return {
    userObj,
    token
  }

}
export const AuthServices = {
  loginService
}

