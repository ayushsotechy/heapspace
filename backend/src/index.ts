import "dotenv/config";
import {
  register,
  httpRequestCounter,
  httpRequestDuration
} from "./metrics";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes";
import submissionRoutes from "./routes/submission.routes";
import problemRoutes from "./routes/problem.routes";
import executeRoutes from "./routes/execute.routes"

// import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4444;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);
app.use(cookieParser());
app.use(express.json()); // Essential for parsing JSON bodies

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({
    method: req.method,
    route: req.path
  });

  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    });

    end();
  });

  next();
});


// Mount the Auth Routes
app.use("/api/auth", authRoutes); 
app.use("/api/admin", adminRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);

app.use("/api/execute", executeRoutes);
app.use("/api/users", authRoutes);

app.get("/", (req, res) => {
  res.send("HeapSpace Backend is Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});