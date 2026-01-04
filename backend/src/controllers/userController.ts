import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import type { RegisterInput, LoginInput } from "../validators/user.schema";

// 1. REGISTER USER
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body as RegisterInput;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists", userId: existingUser.id });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// 2. LOGIN USER
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await prisma.user.findUnique({ where: { email } });
    
    // Check if user exists AND has a password (handles Google-only users)
    if (!user || !user.password) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

   
    const token = jwt.sign(
      { userId: user.id, role: "user" }, // Added 'role: user' for clarity
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );


    res.json({ 
      message: "Login successful",
      token, 
      username: user.username 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};