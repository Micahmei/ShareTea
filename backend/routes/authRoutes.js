const express = require("express");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 路由：验证Google Token
router.post("/google-login", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); // 用户信息
    res.json({
      success: true,
      user: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      },
    });
  } catch (err) {
    console.error("❌ Google Login Failed:", err);
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
});

module.exports = router;
