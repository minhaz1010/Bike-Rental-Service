import httpStatus from "http-status";
import { TErrorMessages } from "../utils";

const handleDuplicateError = (err: any) => {
  const message = "Duplicate Error";
  const statusCode = httpStatus.CONFLICT;
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  const errorMessages: TErrorMessages = [
    {
      path: "",
      message: `${extractedMessage} is already exist`,
    },
  ];

  return {
    message,
    statusCode,
    errorMessages,
  };
};

export default handleDuplicateError;
