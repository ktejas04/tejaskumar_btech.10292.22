import express from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";

const app = express();

app.use(express.json());
app.use("/", healthRouter);
app.use("/auth", authRouter);

export default app;
