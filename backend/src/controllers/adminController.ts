import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
// Import the types we made in Step 1
import type { AdminRegisterInput, AdminLoginInput } from "../validators/admin.schema";

// 1. ADMIN REGISTER
export const adminRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    // We trust req.body because the middleware already checked it!
    const { username, email, password } = req.body as AdminRegisterInput;

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
       res.status(400).json({ error: "Admin already exists" });
       return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { 
        username, // Matches schema.prisma
        email, 
        password: hashedPassword 
      },
    });

    res.status(201).json({ message: "Admin registered successfully", adminId: admin.id });
  } catch (error) {
    console.error("Admin Register Error:", error);
    res.status(500).json({ error: "Admin registration failed" });
  }
};

// 2. ADMIN LOGIN
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as AdminLoginInput;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ message: "Welcome Boss", token, username: admin.username });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};