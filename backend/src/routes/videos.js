
const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const { authenticate: requireAuth } = require("../middleware/authenticate");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Store videos in /uploads/videos/
const uploadDir = path.join(__dirname, "../../uploads/videos");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only video files allowed"));
  }
});

// GET all videos
router.get("/", requireAuth, async (req, res) => {
  try {
    const { grade, subject, studentId } = req.query;
    let q = `SELECT v.*, u.name as teacher_name,
      (SELECT COUNT(*) FROM video_views WHERE video_id = v.id) as view_count
      FROM videos v LEFT JOIN users u ON v.teacher_id = u.id WHERE 1=1`;
    const params = [];
    if (grade) { params.push(grade); q += ` AND v.grade = $${params.length}`; }
    if (subject) { params.push(subject); q += ` AND v.subject = $${params.length}`; }
    q += " ORDER BY v.created_at DESC";
    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST upload video (teacher/admin)
router.post("/", requireAuth, upload.single("video"), async (req, res) => {
  try {
    const { title, subject, grade, assigned_to } = req.body;
    if (!req.file) return res.status(400).json({ error: "No video file uploaded" });
    const url = "/uploads/videos/" + req.file.filename;
    const result = await pool.query(
      `INSERT INTO videos (title, url, subject, grade, teacher_id, assigned_to)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, url, subject, grade, req.user.id, assigned_to ? JSON.parse(assigned_to) : []]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST record a view
router.post("/:id/view", requireAuth, async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO video_views (video_id, user_id) VALUES ($1, $2)
       ON CONFLICT (video_id, user_id) DO UPDATE SET last_watched = now()`,
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE video (admin/teacher only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin" && role !== "teacher")
      return res.status(403).json({ error: "Not allowed" });
    const vid = await pool.query("SELECT url FROM videos WHERE id = $1", [req.params.id]);
    if (!vid.rows[0]) return res.status(404).json({ error: "Not found" });
    // Delete file from disk
    const filePath = path.join(__dirname, "../../", vid.rows[0].url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await pool.query("DELETE FROM videos WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
