import { Router } from "express";
import { router as checkoutRouter } from "./wayforpay/checkout";
import { router as webhookRouter } from "./wayforpay/webhook";

const router = Router();

router.use("/checkout", checkoutRouter);
router.use("/webhook", webhookRouter);

export { router };