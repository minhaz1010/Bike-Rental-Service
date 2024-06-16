import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError";
import { BikeServices } from "./bike.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/appError";

const createBike = catchAsyncErrors(async (req, res) => {
  const result = await BikeServices.createBikeInDatabase(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bike added successfully",
    result,
  });
});

const getAllBike = catchAsyncErrors(async (req, res) => {
  const result = await BikeServices.getAllBikesFromDatabase();
  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No data found");
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bikes retrieved successfully",
    result,
  });
});

const updateBike = catchAsyncErrors(async (req, res) => {
  const result = await BikeServices.updateBikeFromDatabase(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bike updated successfully",
    result,
  });
});

const deleteBike = catchAsyncErrors(async (req, res) => {
  const result = await BikeServices.deleteASingleBikeFromDatabase(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Bike deleted successfully",
    result,
  });
});

export const BikeController = {
  createBike,
  getAllBike,
  updateBike,
  deleteBike,
};
