import { Router } from "express";
import { validate } from "../middlewares/validate"; 
import { adminRegisterSchema, adminLoginSchema } from "../validators/admin.schema"; 
import { createProblemSchema } from "../validators/problem.schema"; // 👈 New Import
import { adminRegister, adminLogin } from "../controllers/adminController";
import { createProblem } from "../controllers/problemController";   // 👈 New Import
import { verifyAdmin } from "../middlewares/authMiddleware";        // 👈 New Import

const router = Router();

// Auth Routes
router.post("/register", validate(adminRegisterSchema), adminRegister);
router.post("/login",    validate(adminLoginSchema),    adminLogin);

// Problem Routes
router.post(
  "/problems", 
  verifyAdmin,                 
  validate(createProblemSchema), 
  createProblem                
);

export default router;