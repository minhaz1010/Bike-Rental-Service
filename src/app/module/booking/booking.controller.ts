import httpStatus from "http-status";
import AppError from "../../errors/appError";
import catchAsyncErrors from "../../utils/catchAsyncError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { BookingServices } from "./booking.service";
import sendResponse from "../../utils/sendResponse";

// * rental  a bike controller
const boookingABike = catchAsyncErrors(async (req, res) => {

  
  const headers = req.headers.authorization;
    // * check if headers is present or not

  if (!headers) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
  }
  const authToken = headers.split("Bearer ")[1];
    // * check if auth token is present or not

  if (!authToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
  }
  // * verify the token
  const payload = jwt.verify(
    authToken,
    config.JWT_SECRET as string,
  ) as JwtPayload;
  if (!payload) {
    throw new AppError(httpStatus.FORBIDDEN, "Payload is corrupted");
  }

  const result = await BookingServices.rentABikeService(payload, req.body);

  sendResponse(res, {
    message: "Rental created successfully",
    statusCode: 200,
    result,
  });
});

const myRentals = catchAsyncErrors(async (req, res) => {
  const headers = req.headers.authorization;
  if (!headers) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
  }
  const authToken = headers.split("Bearer ")[1];
  if (!authToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
  }
  const payload = jwt.verify(
    authToken,
    config.JWT_SECRET as string,
  ) as JwtPayload;
  if (!payload) {
    throw new AppError(httpStatus.FORBIDDEN, "Payload is corrupted");
  }

  const result = await BookingServices.myRentalsService(payload);
  sendResponse(res, {
    message: "Rental retreived successfully",
    statusCode: 200,
    result,
  });
});

const returnBike = catchAsyncErrors(async (req, res) => {
  // const headers = req.headers.authorization;
  // if (!headers) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  // }
  // const authToken = headers.split("Bearer ")[1];
  // if (!authToken) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  // }
  // const payload = jwt.verify(
  //   authToken,
  //   config.JWT_SECRET as string,
  // ) as JwtPayload;
  // if (!payload) {
  //   throw new AppError(httpStatus.FORBIDDEN, "Payload is corrupted");
  // }
  const { id } = req.params;
  const bookingId = id;
  const result = await BookingServices.returnBikeServices(bookingId);
  sendResponse(res, {
    statusCode: 200,
    message: "Bike returned successfully",
    result,
  });
});

export const BookingController = {
  boookingABike,
  myRentals,
  returnBike,
};
