const express = require("express");
const router = express.Router();

// 模拟用户登录（可后续接 Firebase 或 OAuth）
const dummyUsers = [
  { id: 1, name: "Alice", role: "USER" },
  { id: 2, name: "Bob", role: "cashier" },
  { id: 3, name: "Charlie", role: "manager" },
];

// 登录：用 query 模拟用户名
router.get("/login", (req, res) => {
  const name = req.query.name;
  const user = dummyUsers.find(u => u.name.toLowerCase() === name.toLowerCase());

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

module.exports = router;
