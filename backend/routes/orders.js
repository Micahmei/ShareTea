const express = require("express");
const router = express.Router();
const pool = require("../db");

// 顾客下订单
router.post("/", async (req, res) => {
  const { customerName, items } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO orders (customer_name, items) VALUES ($1, $2) RETURNING *",
      [customerName, JSON.stringify(items)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Insert order error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// 管理员查看所有订单
router.get("/", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  
      result.rows.forEach(order => {
        order.items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
      });
  
      res.json(result.rows);
    } catch (error) {
      console.error("Fetch orders error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  

module.exports = router;
