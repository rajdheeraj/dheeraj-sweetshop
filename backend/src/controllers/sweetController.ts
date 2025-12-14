import { Request, Response } from "express";
import Sweet from "../models/Sweet";

// ADD SWEET (ADMIN)
export const addSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;

    const sweet = new Sweet({
      name,
      category,
      price,
      quantity
    });

    await sweet.save();

    res.status(201).json({
      message: "Sweet added successfully",
      sweet
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL SWEETS (USER + ADMIN)
export const getAllSweets = async (req: Request, res: Response) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// SEARCH SWEETS
export const searchSweets = async (req: Request, res: Response) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const filter: any = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(filter);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE SWEET (ADMIN)
export const updateSweet = async (req: Request, res: Response) => {
  try {
    const updatedSweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    res.json({
      message: "Sweet updated successfully",
      sweet: updatedSweet
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE SWEET (ADMIN)
export const deleteSweet = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    res.json({ message: "Sweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// PURCHASE SWEET
export const purchaseSweet = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.json({
      message: "Sweet purchased successfully",
      remainingQuantity: sweet.quantity
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// RESTOCK SWEET (ADMIN)
export const restockSweet = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.json({
      message: "Sweet restocked successfully",
      quantity: sweet.quantity
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
