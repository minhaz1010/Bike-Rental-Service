// eslint-disable-next-line no-unused-vars
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { TErrorMessages } from "../utils";
import { ZodError } from "zod";
import config from "../config";
import handleZodError from "../errors/handleZodError";
import handleDuplicateError from "../errors/handleDuplicateError";
import mongooseValiDationError from "../errors/mongooseValidationError";
import handleCastError from "../errors/handleCastError";
import { handleJsonWebTokenError, handleTokenExpiredError, notBeforeError } from "../errors/jwtError";
import AppError from "../errors/appError";

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
      message: "Something went wrong",
    },
  ];
  // INFO: Duplicate error

  // HACK:

  if (err instanceof ZodError) { // ^ handle zod error
    const getTheErrorData = handleZodError(err);
    message = getTheErrorData.message;
    statusCode = getTheErrorData.statusCode;
    errorMessages = getTheErrorData.errorMessages;
  } else if (err?.errorResponse?.code === 11000) { // ^ handle duplicate error
    const getTheErrorData = handleDuplicateError(err);
    message = getTheErrorData.message;
    statusCode = getTheErrorData.statusCode;
    errorMessages = getTheErrorData.errorMessages;
  } else if (err?.name === "ValidationError") { // ^ handle mongoose validation error
    const getTheErrorData = mongooseValiDationError(err);
    message = getTheErrorData.message;
    statusCode = getTheErrorData.statusCode;
    errorMessages = getTheErrorData.errorMessages;
  } else if (err?.name === "CastError") { // ^ handle cast error
    const getTheErrorData = handleCastError(err);
    message = getTheErrorData.message;
    statusCode = getTheErrorData.statusCode;
    errorMessages = getTheErrorData.errorMessages;
  } else if (err?.name === "TokenExpiredError") { // ^ handle jwt token expiration error
    const getTheErrorData = handleTokenExpiredError(err);
    statusCode = getTheErrorData.statusCode;
    message = getTheErrorData.message;
    errorMessages = getTheErrorData.errorMessages;
  } else if (err?.name === "JsonWebTokenError") { // ^ handle jwt jsonwebtoken error
    const getTheErrorData = handleJsonWebTokenError(err);
    statusCode = getTheErrorData.statusCode;
    message = getTheErrorData.message;
    errorMessages = getTheErrorData.errorMessages;
  } else if (err?.name === "NotBeforeError") { // ^ handle jwt notbeforeerror
    const getTheErrorData = notBeforeError(err);
    statusCode = getTheErrorData.statusCode;
    message = getTheErrorData.message;
    errorMessages = getTheErrorData.errorMessages;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
