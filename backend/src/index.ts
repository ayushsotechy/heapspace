import "dotenv/config";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes";
import submissionRoutes from "./routes/submission.routes";
import problemRoutes from "./routes/problem.routes";
import executeRoutes from "./routes/execute.routes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4444;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json()); // Essential for parsing JSON bodies



// Mount the Auth Routes
app.use("/api/auth", authRoutes); 
app.use("/api/admin", adminRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/execute", executeRoutes);


app.get("/", (req, res) => {
  res.send("HeapSpace Backend is Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});