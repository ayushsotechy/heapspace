import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}


export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
     res.status(401).json({ error: "Access Denied: No Token Provided" });
     return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;

    if (decoded.role !== "admin") {
       res.status(403).json({ error: "Access Denied: Admins Only" });
       return;
    }

    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
         res.status(401).json({ error: "Access Denied: No Token Provided" });
         return;
    }
    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;

        (req as AuthRequest).user = decoded;
        next();

    }
    catch(error){
        res.status(400).json({ error: "Invalid Token" });
    }
}