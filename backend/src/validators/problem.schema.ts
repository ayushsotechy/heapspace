import { z } from "zod";

export const createProblemSchema = z.object({
  title: z.string().min(3, "Title too short"),
  description: z.string().min(10, "Description too short"),
  slug: z.string().min(3, "Slug must be unique and at least 3 chars"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  

  testCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
    })
  ).min(1, "At least one test case is required"),
});

export type CreateProblemInput = z.infer<typeof createProblemSchema>;