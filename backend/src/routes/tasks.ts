import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth";
import { TaskStatus } from "../../prisma/generated/enums";
import { canTransition } from "../utils/taskFsm";

const router = Router();

router.use(authMiddleware);

/**
 * POST /tasks
 * Create a new task for the authenticated user
 * { title, description, dueDate }
 */
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { title, description, dueDate } = req.body;

    // Basic validation
    if (!title || !dueDate) {
      return res.status(400).json({
        message: "Title and dueDate are required",
      });
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? "",
        dueDate: new Date(dueDate),
        userId: req.user!.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
      },
    });

    // Response
    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * GET /tasks
 * List tasks for authenticated user
 * Optional query: ?status=
 */
router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { status } = req.query;

    // Build where clause
    const where: any = {
      userId: req.user!.id,
    };

    if (status) {
      where.status = status;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Response
    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error("List tasks error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

/**
 * PATCH /tasks/:id/status
 * Update task status with FSM validation
 * { status }
 */
router.patch("/:id/status", async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    // Fetch task and verify ownership
    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        userId: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.userId !== req.user!.id) {
      return res.status(403).json({
        message: "Not authorized to update this task",
      });
    }

    // FSM validation
    if (!canTransition(task.status, status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${task.status} to ${status}`,
      });
    }

    // Update status
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status,
      },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    });

    // Response
    return res.status(200).json({
      message: "Task status updated",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task status error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
