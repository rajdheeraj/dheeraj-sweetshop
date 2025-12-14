import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: (req as any).user
  });
});

export default router;