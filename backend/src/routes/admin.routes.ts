import { Router } from "express";
import { prisma } from "../utils/prisma";
import { validate } from "../middlewares/validate"; 
import { adminRegisterSchema, adminLoginSchema } from "../validators/admin.schema"; 
import { createProblemSchema } from "../validators/problem.schema"; // 👈 New Import
import { adminRegister, adminLogin } from "../controllers/adminController";
import { createProblem } from "../controllers/problemController";   // 👈 New Import
import { verifyAdmin } from "../middlewares/authMiddleware";        // 👈 New Import
import { getProblems, getProblem } from "../controllers/problemController";
const router = Router();
// router.use(auth);
// router.use(adminOnly);

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
router.get(
  "/problems",
  verifyAdmin,
  getProblems
);

router.get(
  "/problems/:slug",
  verifyAdmin,
  async (req, res) => {
    const problem = await prisma.problem.findUnique({
      where: { slug: req.params.slug },
      include: { testCases: true }
    });
    res.json({ problem });
  }
);

export default router;