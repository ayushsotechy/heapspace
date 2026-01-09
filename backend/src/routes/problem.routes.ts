import { Router } from "express";
import { getProblems, getProblem } from "../controllers/problemController";

const router = Router();

// GET /api/problems (List all)
router.get("/", getProblems);

// GET /api/problems/two-sum (Get one by slug)
router.get("/:slug", getProblem);

export default router;