import httpStatus from "http-status";
import AppError from "../errors/appError";
import { TUserRole } from "../utils";
import catchAsyncErrors from "../utils/catchAsyncError";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { User } from "../module/user/user.model";
import config from "../config";

export const authMiddleware = (...givenRole: TUserRole[]) => {
  return catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
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

      const { role, email } = payload;
      if (givenRole && !givenRole.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError(httpStatus.FORBIDDEN, "No User Found");
      }

      next();
    },
  );
};
