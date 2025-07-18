import express from "express";
import cors from "cors";
import { router as checkoutRouter } from "./routes/wayforpay/checkout";
import { router as webhookRouter } from "./routes/wayforpay/webhook";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/payment/wayforpay/checkout", checkoutRouter);
app.use("/payment/wayforpay/webhook", webhookRouter);

export { app };