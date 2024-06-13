import { AnyZodObject } from "zod";
import catchAsyncErrors from "../utils/catchAsyncError";
import { NextFunction, Request, Response } from "express";

const validateRequest = (schema: AnyZodObject) => {
  return catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      await schema.parseAsync({
        body: req.body,
      });
      next();
    },
  );
};

export default validateRequest;
