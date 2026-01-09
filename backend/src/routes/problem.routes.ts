import { Router } from "express";
import { getProblems, getProblem } from "../controllers/problemController";

const router = Router();


router.get("/", getProblems);
router.get("/:slug", getProblem);


export default router;