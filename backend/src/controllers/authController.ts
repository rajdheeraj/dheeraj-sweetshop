import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

/* ================= REGISTER ================= */
/*
  RULE:
  - Everyone who registers is a USER
  - ADMIN is created manually in DB (security best practice)
*/
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Always create USER
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "USER", // 🔒 Cannot be overridden by frontend
    });

    await user.save();

    return res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
/*
  - Works for USER and ADMIN
  - Role is embedded in JWT
*/
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role, // 🔑 Used by frontend for UI control
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
