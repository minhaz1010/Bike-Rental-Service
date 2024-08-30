// import httpStatus from "http-status";
import { verifyPayment } from "../../utils/bookingUtils";
import catchAsyncErrors from "../../utils/catchAsyncError";
// import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";
import path from "path";
import { readFileSync } from "fs";

const confirmPayment = catchAsyncErrors(async (req, res) => {
  const { transactionId, status } = req.query;
  const response = await verifyPayment(transactionId as string);
  const filePath = path.join(__dirname, "../../views/fail.html");
  const template = readFileSync(filePath, "utf-8");
  if (response.pay_status === "Successful") {
    const paymentMoney = Number(response.amount_bdt);
    const result = await PaymentServices.confirmPaymentService(
      transactionId as string,
      status as string,
      paymentMoney,
    );
    res.send(result);
  } else {
    res.send(template);
  }
});

export const PaymentController = {
  confirmPayment,
};
