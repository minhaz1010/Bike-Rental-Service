import { z } from "zod";

const loginAuth = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const changePasswordValidation = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Give Your Old Password" }),
    newPassword: z.string({ required_error: "Give Your New Password" }),
  }),
});

export const AuthValidations = {
  loginAuth,
  changePasswordValidation,
};
