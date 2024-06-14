import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser = catchAsyncErrors(async (req, res) => {
  const result = await UserServices.createUserInDatabase(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    result,
  });
});

export const UserControllers = {
  createUser,
};
