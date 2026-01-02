import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login } from "../controllers/authController";
import "../utils/passport";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    // Generate JWT for the Google User
    const user = req.user as any;
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1d" }
    );

    // In a real app, you redirect to frontend with the token in URL
    // For now, let's just show it in JSON
    res.json({ message: "Google Login Successful", token });
  }
);


export default router;