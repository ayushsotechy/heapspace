import { Router } from "express";
// import { verifyToken } from "../middlewares/authMiddleware"; // <--- REMOVED
import { submitCode, getMySubmissions } from "../controllers/submissionController";

const router = Router();

// POST /api/submissions (No Auth)
router.post("/", submitCode);

// GET /api/submissions/my (No Auth)
router.get("/my", getMySubmissions);

export default router;