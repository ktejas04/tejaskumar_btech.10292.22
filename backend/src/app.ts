import express from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";
import usersRouter from "./routes/users";

const app = express();

app.use(express.json());
app.use("/", healthRouter);
app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);
app.use("/users", usersRouter);

export default app;
