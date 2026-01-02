import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes"; // <--- Import the routes

dotenv.config();


const app = express();
const PORT = process.env.PORT || 4444;

app.use(cors());
app.use(express.json()); // Essential for parsing JSON bodies

// Mount the Auth Routes
app.use("/api/auth", authRoutes); 

app.get("/", (req, res) => {
  res.send("HeapSpace Backend is Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});