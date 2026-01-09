import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { submitCode, getMySubmissions } from "../controllers/submissionController";

const router = Router();

// POST /api/submissions/submit
router.post("/", verifyToken, submitCode);

// GET /api/submissions/mine
router.get("/my", verifyToken, getMySubmissions);

export default router;
