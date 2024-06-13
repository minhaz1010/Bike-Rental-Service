import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = 500;
  let message;
  try {
    message = JSON.parse(err.message);
  } catch {
    message = err.message || "Something went wrong";
  }

  res.status(statusCode).json({
    success: false,
    message,
    err,
  });
};

export default globalErrorHandler;
