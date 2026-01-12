import { Request, Response } from "express";
import axios from "axios";

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  cpp: { language: "c++", version: "10.2.0" },
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  java: { language: "java", version: "15.0.2" },
};


export const executeCode = async (req: Request, res: Response): Promise<void> => {
  const { language, code, input } = req.body;

  if (!code || !language) {
    res.status(400).json({ error: "Code and language are required" });
    return;
  }

  const pistonConfig = LANGUAGE_MAP[language];
  if (!pistonConfig) {
    res.status(400).json({ error: "Unsupported language" });
    return;
  }

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: pistonConfig.language,
      version: pistonConfig.version,
      files: [{ content: code }],
      stdin: input || "", 
    });

    const { stdout, stderr, code: exitCode } = response.data.run;

    // Return everything so frontend can decide how to display it
    res.json({ 
      output: stdout, 
      error: stderr, 
      exitCode 
    });

  } catch (error) {
    console.error("Execution Error:", error);
    res.status(500).json({ error: "Failed to execute code" });
  }
};