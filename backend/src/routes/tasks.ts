import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

export default router;
