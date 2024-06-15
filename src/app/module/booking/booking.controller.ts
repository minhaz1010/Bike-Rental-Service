import httpStatus from "http-status";
import AppError from "../../errors/appError";
import catchAsyncErrors from "../../utils/catchAsyncError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { BookingServices } from "./booking.service";
import sendResponse from "../../utils/sendResponse";

const boookingABike = catchAsyncErrors(async (req, res) => {
  const headers = req.headers.authorization;
  if (!headers) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }
  const authToken = headers.split("Bearer ")[1];
  if (!authToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }
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

export const BookingController = {
  boookingABike,
};
