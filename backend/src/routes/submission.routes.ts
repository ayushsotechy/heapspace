import { Router } from "express";
// import { verifyToken } from "../middlewares/authMiddleware"; // <--- REMOVED
import { submitCode, getMySubmissions } from "../controllers/submissionController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// POST /api/submissions (No Auth)
router.post("/",verifyToken, submitCode);

// GET /api/submissions/my (No Auth)
router.get("/my",verifyToken, getMySubmissions);

export default router;