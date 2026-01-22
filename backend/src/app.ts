import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";
import usersRouter from "./routes/users.js";

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
