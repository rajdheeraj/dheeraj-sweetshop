import express from "express";
import { addSweet, getAllSweets, searchSweets, updateSweet, deleteSweet, purchaseSweet, restockSweet} from "../controllers/sweetController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

// Admin only
router.post("/", authMiddleware, adminMiddleware, addSweet);

// Logged-in users
router.get("/", authMiddleware, getAllSweets);
router.get("/search", authMiddleware, searchSweets);
router.put("/:id", authMiddleware, adminMiddleware, updateSweet);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSweet);
router.post("/:id/purchase", authMiddleware, purchaseSweet);
router.post("/:id/restock", authMiddleware, adminMiddleware, restockSweet);


export default router;