import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError";
import { BikeServices } from "./bike.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/appError";

const createBike = catchAsyncErrors(async (req, res) => {
  const result = await BikeServices.createBikeInDatabase(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Bike added successfully",
    result,
  });
});

const getAllBike = catchAsyncErrors(async (req, res) => {
  const result = await BikeServices.getAllBikesFromDatabase();

  console.log({ result });

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Sorry there is no bike")
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bikes retrieved successfully",
    result
  })
})



export const BikeController = {
  createBike,
  getAllBike
};
