import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import sweetRoutes from "./routes/sweetRoutes";

dotenv.config();

const app = express();

// ✅ CORS FIX (THIS IS THE KEY)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// ✅ JSON BODY PARSER
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/sweets", sweetRoutes);

app.get("/", (req, res) => {
  res.send("Sweet Shop Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
