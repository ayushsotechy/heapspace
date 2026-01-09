import { Request, Response } from "express"; // Import Request (standard)
import { prisma } from "../utils/prisma";
import type { CreateProblemInput } from "../validators/problem.schema";
import { AuthRequest } from "../middlewares/authMiddleware";


export const createProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, slug, difficulty, testCases } = req.body as CreateProblemInput;
    

    const adminId = (req as AuthRequest).user?.id;

    if (!adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        slug,
        difficulty,
        adminId: adminId,
        testCases: {
          create: testCases
        }
      },
      include: {
        testCases: true
      }
    });

    res.status(201).json({ message: "Problem created successfully", problem: newProblem });

  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: "A problem with this slug already exists" });
      return;
    }
    console.error("Create Problem Error:", error);
    res.status(500).json({ error: "Failed to create problem" });
  }
};


export const getProblems = async (req: Request, res: Response): Promise<void> => {
    try{
        const problems = await prisma.problem.findMany({
            select :{
                id:true,
                title:true,
                slug:true,
                difficulty: true
            }
        });
        res.json({problems});
    }
    catch(error){
        res.status(500).json({ error: "Failed to fetch problems" });
    }
}

export const getProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        testCases: true // We need these to run code against!
      }
    });

    if (!problem) {
      res.status(404).json({ error: "Problem not found" });
      return;
    }

    res.json({ problem });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch problem" });
  }
};