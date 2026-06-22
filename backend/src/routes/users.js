const express  = require("express");
const router   = express.Router();
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");
const { query } = require("../config/db");
const { authenticate } = require("../middleware/authenticate");
const { kickUser } = require("../websocket/socket");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads/avatars");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.user.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Images only"));
  }
});

// GET /users — list all users (with avatar)
router.get("/", authenticate, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id,name,email,phone,role,status,avatar_url,created_at FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /users/me — current user profile
router.get("/me", authenticate, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id,name,email,phone,role,grade,status,avatar_url,created_at FROM users WHERE id=$1",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /users/avatar — upload profile picture
router.post("/avatar", authenticate, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Delete old avatar
    const old = await query("SELECT avatar_url FROM users WHERE id=$1", [req.user.id]);
    if (old.rows[0]?.avatar_url) {
      const oldPath = path.join(__dirname, "../../", old.rows[0].avatar_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await query("UPDATE users SET avatar_url=$1 WHERE id=$2", [avatarUrl, req.user.id]);
    res.json({ success: true, avatar_url: avatarUrl });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// DELETE /users/avatar — remove profile picture
router.delete("/avatar", authenticate, async (req, res) => {
  try {
    const old = await query("SELECT avatar_url FROM users WHERE id=$1", [req.user.id]);
    if (old.rows[0]?.avatar_url) {
      const oldPath = path.join(__dirname, "../../", old.rows[0].avatar_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    await query("UPDATE users SET avatar_url=NULL WHERE id=$1", [req.user.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PATCH /users/me — update name, phone, password
router.patch("/me", authenticate, async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const { rows } = await query("SELECT * FROM users WHERE id=$1", [req.user.id]);
    if (!rows[0]) return res.status(404).json({ error: "User not found" });
    const user = rows[0];
    if (newPassword) {
      const bcrypt = require("bcrypt");
      const valid = await bcrypt.compare(currentPassword || "", user.password_hash);
      if (!valid) return res.status(400).json({ error: "Current password is incorrect" });
      const hash = await bcrypt.hash(newPassword, 12);
      await query("UPDATE users SET password_hash=$1 WHERE id=$2", [hash, req.user.id]);
    }
    await query(
      "UPDATE users SET name=COALESCE($1,name), phone=COALESCE($2,phone) WHERE id=$3",
      [name||null, phone||null, req.user.id]
    );
    const { rows: updated } = await query(
      "SELECT id,name,email,phone,role,grade,status,avatar_url FROM users WHERE id=$1",
      [req.user.id]
    );
    res.json(updated[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// DELETE /users/:id — permanently delete a user (admin only)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    // Only admins can delete users
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ error: "You cannot delete your own account." });
    }

    // Check user exists
    const { rows } = await query("SELECT * FROM users WHERE id=$1", [id]);
    if (!rows[0]) return res.status(404).json({ error: "User not found" });

    // Delete their avatar file if it exists
    if (rows[0].avatar_url) {
      const avatarPath = path.join(__dirname, "../../", rows[0].avatar_url);
      if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
    }

    // Permanently delete from database
    await query("DELETE FROM users WHERE id=$1", [id]);

    // Force-disconnect them immediately if they're online
    kickUser(id, 'account_deleted');

    res.json({ success: true, message: `User ${rows[0].name} permanently deleted.` });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
