import { ErrorRequestHandler } from "express";
import { TErrorMessages } from "../utils";
import { ZodError } from "zod";
import handleZodError from "./handleZodError";
import handleDuplicateError from "./handleDuplicateError";
import mongooseValiDationError from "./mongooseValidationError";
import handleCastError from "./handleCastError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message;
  try {
    message = JSON.parse(err.message);
  } catch {
    message = err.message || "Something went wrong";
  }
  let errorMessages: TErrorMessages = [
    {
      path: "",
      message: "Something went wrong"
    }
  ]
  // INFO: Duplicate error 

  // HACK: 



  if (err instanceof ZodError) {
    const getTheErrorData = handleZodError(err)
    message = getTheErrorData.message;
    statusCode = getTheErrorData.statusCode;
    errorMessages = getTheErrorData.errorMessages
  } else if (err?.errorResponse?.code === 11000) {
    const getTheErrorData = handleDuplicateError(err);
    message = getTheErrorData.message;
    statusCode = getTheErrorData.statusCode;
    errorMessages = getTheErrorData.errorMessages;
  } else if (err?.name === "ValidationError") {
    const getTheErrorData = mongooseValiDationError(err);
    message = getTheErrorData.message;
    statusCode = getTheErrorData.statusCode;
    errorMessages = getTheErrorData.errorMessages;
  } else if (err?.name === "CastError") {
    const getTheErrorData = handleCastError(err);
    message = getTheErrorData.message;
    statusCode = getTheErrorData.statusCode;
    errorMessages = getTheErrorData.errorMessages;
  }


  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    err,
  });
};

export default globalErrorHandler;
