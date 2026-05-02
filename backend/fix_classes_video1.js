const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const base = "C:/Users/pc/Downloads/eduapp/backend";
const front = "C:/Users/pc/Downloads/eduapp/frontend/src";

// 1. Generate JWT secret
const jwtSecret = crypto.randomBytes(64).toString("hex");

// ── BACKEND FILES ──────────────────────────────────────────────

// Classes route
fs.mkdirSync(`${base}/src/routes`, { recursive: true });
fs.writeFileSync(`${base}/src/routes/classes.js`, `
const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth");

// GET all classes (admin/teacher sees all, student sees own)
router.get("/", requireAuth, async (req, res) => {
  try {
    const { role, id } = req.user;
    let result;
    if (role === "admin") {
      result = await pool.query(
        \`SELECT c.*, u.name as teacher_name,
          (SELECT COUNT(*) FROM users WHERE class_id = c.id) as student_count
         FROM classes c
         LEFT JOIN users u ON c.teacher_id = u.id
         ORDER BY c.created_at DESC\`
      );
    } else if (role === "teacher") {
      result = await pool.query(
        \`SELECT c.*, u.name as teacher_name,
          (SELECT COUNT(*) FROM users WHERE class_id = c.id) as student_count
         FROM classes c
         LEFT JOIN users u ON c.teacher_id = u.id
         WHERE c.teacher_id = $1
         ORDER BY c.created_at DESC\`,
        [id]
      );
    } else {
      result = await pool.query(
        \`SELECT c.*, u.name as teacher_name
         FROM classes c
         LEFT JOIN users u ON c.teacher_id = u.id
         WHERE c.id = (SELECT class_id FROM users WHERE id = $1)\`,
        [id]
      );
    }
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET single class + its students
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const cls = await pool.query("SELECT * FROM classes WHERE id = $1", [req.params.id]);
    const students = await pool.query(
      "SELECT id, name, email, grade, status FROM users WHERE class_id = $1 ORDER BY name",
      [req.params.id]
    );
    res.json({ ...cls.rows[0], students: students.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST create class
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, grade, subject, teacher_id } = req.body;
    const result = await pool.query(
      "INSERT INTO classes (name, grade, subject, teacher_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, grade, subject, teacher_id || req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT update class
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { name, grade, subject, teacher_id } = req.body;
    const result = await pool.query(
      "UPDATE classes SET name=$1, grade=$2, subject=$3, teacher_id=$4 WHERE id=$5 RETURNING *",
      [name, grade, subject, teacher_id, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE class
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM classes WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Assign student to class
router.post("/:id/assign", requireAuth, async (req, res) => {
  try {
    const { student_id } = req.body;
    await pool.query("UPDATE users SET class_id = $1 WHERE id = $2", [req.params.id, student_id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
`);
console.log("wrote classes.js route");

// Videos route with upload + view count + delete
fs.writeFileSync(`${base}/src/routes/videos.js`, `
const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth");
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
    let q = \`SELECT v.*, u.name as teacher_name,
      (SELECT COUNT(*) FROM video_views WHERE video_id = v.id) as view_count
      FROM videos v LEFT JOIN users u ON v.teacher_id = u.id WHERE 1=1\`;
    const params = [];
    if (grade) { params.push(grade); q += \` AND v.grade = $\${params.length}\`; }
    if (subject) { params.push(subject); q += \` AND v.subject = $\${params.length}\`; }
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
      \`INSERT INTO videos (title, url, subject, grade, teacher_id, assigned_to)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *\`,
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
      \`INSERT INTO video_views (video_id, user_id) VALUES ($1, $2)
       ON CONFLICT (video_id, user_id) DO UPDATE SET last_watched = now()\`,
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
`);
console.log("wrote videos.js route");

// video_views migration
fs.writeFileSync(`${base}/src/db/migrate4.js`, `
require("dotenv").config();
const { Pool } = require("pg");
const p = new Pool({ connectionString: process.env.DATABASE_URL });
const sqls = [
  "CREATE TABLE IF NOT EXISTS video_views (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), video_id UUID REFERENCES videos(id) ON DELETE CASCADE, user_id UUID REFERENCES users(id) ON DELETE CASCADE, last_watched TIMESTAMPTZ DEFAULT now(), UNIQUE(video_id, user_id))",
  "CREATE INDEX IF NOT EXISTS idx_video_views_video ON video_views(video_id)",
  "CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id)",
  "CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id)",
  "CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)",
  "CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id)",
  "CREATE INDEX IF NOT EXISTS idx_videos_grade ON videos(grade, subject)",
  "CREATE INDEX IF NOT EXISTS idx_users_class ON users(class_id)"
];
async function run() {
  for (const s of sqls) {
    await p.query(s);
    console.log("OK:", s.slice(0, 70));
  }
  await p.end();
  console.log("Migration 4 complete!");
}
run().catch(e => { console.error(e.message); p.end(); });
`);
console.log("wrote migrate4.js");

// Update .env JWT secret
const envPath = `${base}/.env`;
let env = fs.readFileSync(envPath, "utf8");
if (env.includes("supersecretkey")) {
  env = env.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${jwtSecret}`);
  fs.writeFileSync(envPath, env);
  console.log("JWT_SECRET updated in .env");
} else {
  console.log("JWT_SECRET already changed or not found — check manually");
}

// Serve /uploads statically — patch app.js
const appPath = `${base}/src/app.js`;
let app = fs.readFileSync(appPath, "utf8");
if (!app.includes("uploads")) {
  app = app.replace(
    "const express = require",
    "const path = require('path');\nconst express = require"
  );
  app = app.replace(
    "app.use(express.json",
    "app.use('/uploads', express.static(path.join(__dirname, '../uploads')));\napp.use(express.json"
  );
  fs.writeFileSync(appPath, app);
  console.log("patched app.js to serve /uploads");
}

// Register /classes and /videos in app.js
app = fs.readFileSync(appPath, "utf8");
if (!app.includes("/classes")) {
  app = app.replace(
    "module.exports = app",
    "app.use('/classes', require('./routes/classes'));\napp.use('/videos', require('./routes/videos'));\nmodule.exports = app"
  );
  fs.writeFileSync(appPath, app);
  console.log("registered /classes and /videos in app.js");
}

console.log("\n=== ALL DONE ===");
console.log("New JWT secret:", jwtSecret);
console.log("\nNEXT STEPS:");
console.log("1. node src/db/migrate4.js");
console.log("2. npm run dev");