import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "username can contain only letters, numbers, and underscore (_)"
    ),

  email: z
    .string()
    .email("invalid email"),

  password: z
    .string()
    .min(6, "password must be at least 6 characters")
    .regex(
      /[a-zA-Z]/,
      "password must contain at least one letter"
    )
    .regex(
      /[0-9]/,
      "password must contain at least one number"
    )
    .regex(
      /[-!@#$%^&*(),.?":{}|<>]/,
      "password must contain at least one special character (including -)"
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("invalid email"),
  password: z.string().min(1, "password required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
