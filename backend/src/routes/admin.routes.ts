import { Router } from "express";
import { validate } from "../middlewares/validate"; 
import { adminRegisterSchema, adminLoginSchema } from "../validators/admin.schema"; 
import { adminRegister, adminLogin } from "../controllers/adminController";

const router = Router();

// POST /api/admin/register
router.post(
  "/register", 
  validate(adminRegisterSchema), // 🛡️ Checks Zod first
  adminRegister                  // 🏃 Then runs controller
);

// POST /api/admin/login
router.post(
  "/login", 
  validate(adminLoginSchema), 
  adminLogin
);

export default router;