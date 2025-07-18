import express from "express";
import cors from "cors";
import { router as wayforpayRouter } from "./routes/wayforpay";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/payment/wayforpay", wayforpayRouter);

export { app };