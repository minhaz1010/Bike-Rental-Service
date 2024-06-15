import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const login = catchAsyncErrors(async (req, res) => {
  const result = await AuthServices.loginService(req.body);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    token: result.token,
    data: result.userObj,
  });
});

const signUp = catchAsyncErrors(async (req, res) => {
  const result = await AuthServices.signUpAUserService(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    result,
  });
});

export const AuthControllers = {
  login,
  signUp,
};
