import express from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";

const app = express();

app.use(express.json());
app.use("/", healthRouter);
app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);

export default app;
