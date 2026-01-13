import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

/**
 * GET /users/me
 * Fetch current authenticated user
 */
router.get("/me", async (req: AuthenticatedRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * PATCH /users/email
 * Update user email
 * { email: string }
 */
router.patch("/email", async (req: AuthenticatedRequest, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { email },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      message: "Email updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update email error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
