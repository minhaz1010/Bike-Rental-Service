import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post("/confirmation", PaymentController.confirmPayment);

router.post("/final-confirmation", PaymentController.finalPayment);

export const PaymentRoutes = router;
