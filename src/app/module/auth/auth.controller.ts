import catchAsyncErrors from "../../utils/catchAsyncError";
import { AuthServices } from "./auth.service";

const login = catchAsyncErrors(async (req, res) => {

  const result = await AuthServices.loginService(req.body);
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token: result.token,
    data: result.userObj
  })
})

export const AuthControllers = {
  login
}
