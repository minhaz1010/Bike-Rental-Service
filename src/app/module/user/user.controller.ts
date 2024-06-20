import catchAsyncErrors from "../../utils/catchAsyncError";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import config from "../../config";

const seeUserProfile = catchAsyncErrors(async (req, res) => {
  
  const headers = req.headers.authorization;
  // * check if headers is present or not
  if (!headers) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
  }
  const authToken = headers.split("Bearer ")[1];
  // * check if authToken is present or not

  if (!authToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You have no access to this route');
  }
  // * verify the authtoken
  const payload = jwt.verify(
    authToken,
    config.JWT_SECRET as string,
  ) as JwtPayload;

  if (!payload) {
    throw new AppError(httpStatus.FORBIDDEN, "Payload is corrupted");
  }

  const result = await UserServices.seeProfileServices(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    result,
  });
});

const updateUserProfile = catchAsyncErrors(async (req, res) => {
  const headers = req.headers.authorization;
    // * check if headers is present or not

  if (!headers) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
  }
  const authToken = headers.split("Bearer ")[1];
  // * check if auth token is present or not

  if (!authToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You have no access to this route')
  }
  const payload = jwt.verify(
    authToken,
    config.JWT_SECRET as string,
  ) as JwtPayload;

  if (!payload) {
    throw new AppError(httpStatus.FORBIDDEN, "Payload is corrupted");
  }

  const result = await UserServices.updateProfileServices(payload, req.body);
  sendResponse(res, {
    statusCode: 200,
    message: "Profile updated successfully",
    result,
  });
});

export const UserController = {
  seeUserProfile,
  updateUserProfile,
};
