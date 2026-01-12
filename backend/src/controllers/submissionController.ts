import { Request, Response } from "express";
import axios from "axios"; 
import { prisma } from "../utils/prisma";
// import { AuthRequest } from "../middlewares/authMiddleware"; // <--- Not needed anymore
import { z } from "zod";

const submissionSchema = z.object({
  problemId: z.number(),
  language: z.string(),
  code: z.string().min(1, "Code cannot be empty"),
});

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
    
    // --- UPDATED: BYPASS AUTH ---
    // Since we aren't using verifyToken, we hardcode ID to 1 (or any existing user ID)
    const userId = 1; 
    // ----------------------------

    // 1. Check language
    const pistonConfig = LANGUAGE_MAP[language];
    if (!pistonConfig) {
      res.status(400).json({ error: "Unsupported language" });
      return;
    }

    // 2. Fetch Problem
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      res.status(404).json({ error: "Problem not found" });
      return;
    }

    // 3. Create "Pending" Submission
    const submission = await prisma.submission.create({
      data: {
        userId, // Uses the hardcoded ID
        problemId,
        language,
        code,
        status: "Pending",
      },
    });

    // 4. JUDGE LOGIC
    let finalStatus = "Accepted"; 

    for (const testCase of problem.testCases) {
      try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
          language: pistonConfig.language,
          version: pistonConfig.version,
          files: [{ content: code }],
          stdin: testCase.input, 
        });

        const { stdout, stderr, code: exitCode } = response.data.run;

        if (exitCode !== 0) {
            console.log(`Runtime Error for TC ${testCase.id}:`, stderr);
            finalStatus = "Runtime Error";
            break; 
        }

        const actualOutput = stdout.trim();
        const expectedOutput = testCase.output.trim();

        if (actualOutput !== expectedOutput) {
          finalStatus = "Wrong Answer";
          break; 
        }
      } catch (error) {
        console.error("Piston API Error:", error);
        finalStatus = "Runtime Error";
        break;
      }
    }

    // 5. Update Status
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

export const getMySubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
        // --- UPDATED: BYPASS AUTH ---
        const userId = 1; 
        // ----------------------------

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