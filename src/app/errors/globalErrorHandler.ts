import { ErrorRequestHandler } from "express";
import { TErrorMessages } from "../utils";
import { ZodError } from "zod";

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
  const handleZodError = (err: ZodError) => {
    const statusCode = 400;
    const message = "Validation Error";
    const errorMessages: TErrorMessages = err.issues.map((error) => {
      return {
        path: error.path[error.path.length - 1] as string,
        message: error.message
      }
    })

    return {
      statusCode,
      message,
      errorMessages
    }


  }

  if (err instanceof ZodError) {
    const getTheErrorData = handleZodError(err)
    message = getTheErrorData.message;
    statusCode = getTheErrorData.statusCode;
    errorMessages = getTheErrorData.errorMessages
  }


  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    err,
  });
};

export default globalErrorHandler;
