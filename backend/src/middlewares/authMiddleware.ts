import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}
export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "please login first" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: number; role: string };

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Admins only" });
    }

    (req as AuthRequest).user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: "invalid token" });
  }
};



export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "please login first"
    });
  }
  console.log("🔍 [AuthMiddleware] Cookies received:", req.cookies);
    console.log("🔍 [AuthMiddleware] Token found:", token ? "YES" : "NO");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: number; role?: string };

    (req as AuthRequest).user = {
      id: decoded.id,
      role: decoded.role ?? "USER"
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "invalid token"
    });
  }
};
