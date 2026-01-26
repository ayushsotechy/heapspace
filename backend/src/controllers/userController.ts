import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import type { RegisterInput, LoginInput } from "../validators/user.schema";
import { AuthRequest } from "../middlewares/authMiddleware";

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
      { id: user.id, role: "USER" }, 
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res
    .cookie("token", token,{
      httpOnly: true,
      sameSite:"lax",
      secure: false})
    .json({ 
      message: "Login successful",
      token, 
      username: user.username,
      role:"USER" 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// 3. GET ME (Auth Check)
export const getMe = async (req: Request, res: Response) => {
  const authUser = (req as any).user;

  if (!authUser) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // If admin
  if (authUser.role === "ADMIN") {
    const admin = await prisma.admin.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    return res.json({
      user: { ...admin, role: "ADMIN" }
    });
  }

  // Normal user
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true,
      username: true,
      email: true
    }
  });

  return res.json({
    user: { ...user, role: "USER" }
  });
};

// 4. GET USER PROFILE (Activity Page)
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;

    // 1. DYNAMIC CHECK: Get ID from the logged-in user's token
    if (!authReq.user) {
        res.status(401).json({ error: "Unauthorized: User ID not found" });
        return; 
    }

    const userId = authReq.user.id; 
    
    // --- DEBUG LOGS (Watch your terminal) ---
    console.log("🔍 Fetching profile for User ID:", userId);
    const debugSubs = await prisma.submission.findMany({ where: { userId } });
    console.log(`🔍 Found ${debugSubs.length} total submissions for this user.`);
    if (debugSubs.length > 0) {
        console.log(`🔍 First submission status in DB: "${debugSubs[0].status}"`);
    }
    // ----------------------------------------

    // 2. Get User Details
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, email: true, createdAt: true }
    });

    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    // 3. Get Solved Problems (Accepted & Distinct)
    // FIX: Added mode: 'insensitive' to match "Accepted", "accepted", "ACCEPTED"
    const solvedSubmissions = await prisma.submission.findMany({
      where: { 
        userId, 
        status: { equals: "Accepted", mode: "insensitive" } 
      },
      distinct: ["problemId"],
      include: {
        problem: { select: { difficulty: true } },
      },
    });
    
    console.log("🔍 Solved Count returning:", solvedSubmissions.length); 

    // 4. Calculate Stats
    // FIX: Added ?. safety checks in case problem is null
    const solvedStats = {
      easy: solvedSubmissions.filter((s) => s.problem?.difficulty === "Easy").length,
      medium: solvedSubmissions.filter((s) => s.problem?.difficulty === "Medium").length,
      hard: solvedSubmissions.filter((s) => s.problem?.difficulty === "Hard").length,
      total: solvedSubmissions.length,
    };

    const totalProblemsGrouped = await prisma.problem.groupBy({
        by: ['difficulty'],
        _count: true
    });

    const totalProblemsStats = totalProblemsGrouped.reduce((acc, curr) => {
        // Ensure difficulty exists before lowercasing
        if (curr.difficulty) {
            acc[curr.difficulty.toLowerCase()] = curr._count;
        }
        return acc;
    }, { easy: 0, medium: 0, hard: 0 } as Record<string, number>);

    // 5. Language Stats
    const languageStats = await prisma.submission.groupBy({
      by: ["language"],
      where: { userId },
      _count: true,
    });

    // 6. Heatmap Data
    const allSubmissions = await prisma.submission.findMany({
      where: { userId },
      select: { createdAt: true },
    });

    const heatmap: Record<string, number> = {};
    allSubmissions.forEach((sub) => {
      const date = sub.createdAt.toISOString().split("T")[0];
      heatmap[date] = (heatmap[date] || 0) + 1;
    });

    // 7. Dynamic Ranking
    const leaderboard = await prisma.submission.groupBy({
      by: ['userId'],
      where: { status: { equals: "Accepted", mode: "insensitive" } },
      _count: { problemId: true }
    });

    const sortedLeaderboard = leaderboard
      .map(u => ({ userId: u.userId, solved: u._count.problemId }))
      .sort((a, b) => b.solved - a.solved);

    const myRankIndex = sortedLeaderboard.findIndex(u => u.userId === userId);
    const realRank = myRankIndex === -1 ? sortedLeaderboard.length + 1 : myRankIndex + 1;
    const totalUsers = await prisma.user.count();

    res.json({
      user,
      solvedStats,
      totalProblemsStats,
      languageStats,
      heatmap,
      totalSubmissions: allSubmissions.length,
      realRank,
      totalUsers,
    });

  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};