import { Request, Response } from "express";
import axios from "axios"; // 👈 New Import
import { prisma } from "../utils/prisma";
import { AuthRequest } from "../middlewares/authMiddleware";
import { z } from "zod";

const submissionSchema = z.object({
  problemId: z.number(),
  language: z.string(),
  code: z.string().min(1, "Code cannot be empty"),
});

// Helper to map your languages to Piston's API format
const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  cpp: { language: "c++", version: "10.2.0" },
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  java: { language: "java", version: "15.0.2" },
};

export const submitCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = submissionSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.issues[0].message });
      return;
    }

    const { problemId, language, code } = validation.data;
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // 1. Check if language is supported
    const pistonConfig = LANGUAGE_MAP[language];
    if (!pistonConfig) {
      res.status(400).json({ error: "Unsupported language" });
      return;
    }

    // 2. Fetch the Problem AND its Test Cases
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      res.status(404).json({ error: "Problem not found" });
      return;
    }

    // 3. Create "Pending" Submission first (so we have a record)
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        language,
        code,
        status: "Pending",
      },
    });

    // 4. THE JUDGE LOGIC 
    // We will assume it's Accepted, until we find a failing test case
    let finalStatus = "Accepted"; 

    // Loop through all test cases
    for (const testCase of problem.testCases) {
      try {
        // Call Piston API
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
          language: pistonConfig.language,
          version: pistonConfig.version,
          files: [{ content: code }],
          stdin: testCase.input, // Pass test case input here
        });

        const output = response.data.run.output?.trim(); // Clean up whitespace
        const expectedOutput = testCase.output.trim();

        // Debugging: Print to console so you can see what's happening
        console.log(`Test Case ID: ${testCase.id}`);
        console.log(`Expected: ${expectedOutput}`);
        console.log(`Actual:   ${output}`);

        if (output !== expectedOutput) {
          finalStatus = "Wrong Answer";
          break; // Stop checking after first failure
        }
      } catch (error) {
        console.error("Execution Error:", error);
        finalStatus = "Runtime Error";
        break;
      }
    }

    // 5. Update the Submission Status in DB
    const updatedSubmission = await prisma.submission.update({
      where: { id: submission.id },
      data: { status: finalStatus },
    });

    res.json({
      message: "Submission processed",
      submissionId: updatedSubmission.id,
      status: finalStatus,
    });

  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ error: "Failed to process submission" });
  }
};

// ... keep your getMySubmissions function below ...
export const getMySubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.id;
        const submissions = await prisma.submission.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { problem: { select: { title: true, slug: true } } }
        });
        res.json({ submissions });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
};