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
      // * check if headers present or not
      if (!headers) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
      }
      const authToken = headers.split("Bearer ")[1];
      // * check authToken is present or not
      if (!authToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
      }
      // * then verify the authToken 
      const payload = jwt.verify(
        authToken,
        config.JWT_SECRET as string,
      ) as JwtPayload;
      if (!payload) {
        throw new AppError(httpStatus.FORBIDDEN, "Payload is corrupted");
      }
      // * if everything is okay then extract the role and email from payload
      const { role, email } = payload;
      // * check if the role is included or not
      if (givenRole && !givenRole.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You have no access to this route");
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError(httpStatus.FORBIDDEN, "No User Found");
      }
      next();
    },
  );
};
