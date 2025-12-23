import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import sweetRoutes from "./routes/sweetRoutes";

dotenv.config();

const app = express();

// ✅ CORS (PRODUCTION SAFE)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
  })
);

// ✅ JSON BODY PARSER
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/sweets", sweetRoutes);

// HEALTH CHECK
app.get("/", (_req, res) => {
  res.send("Sweet Shop Backend Running");
});

// ✅ CONNECT DB & START SERVER
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
