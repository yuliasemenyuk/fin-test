import express from "express";
import cors from "cors";
import { router as wayforpayRouter } from "./routes/wayforpay";
import { router as usersRouter } from "./routes/users";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/payment/wayforpay", wayforpayRouter);
app.use("/users", usersRouter);

export { app };