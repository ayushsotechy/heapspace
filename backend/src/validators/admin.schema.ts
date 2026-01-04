import { z } from "zod";

// 1. Admin Register Rules
export const adminRegisterSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 2. Admin Login Rules
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Export TypeScript types (for the controller to use)
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;