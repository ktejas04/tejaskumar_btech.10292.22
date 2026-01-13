import express from "express";
import cors from "cors";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";
import usersRouter from "./routes/users";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // Deployed frontend URL can be added here - remove localhost in production
    ],
    credentials: true,
  })
);

app.use("/", healthRouter);
app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);
app.use("/users", usersRouter);

export default app;
