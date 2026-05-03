const express = require("express");
const router  = express.Router();
const pool    = require("../db/pool");
const { authenticate: requireAuth } = require("../middleware/authenticate");
const multer  = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

// Configure Cloudinary from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — file goes straight to Cloudinary, not disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only video files allowed"));
  },
});

// Helper: stream buffer to Cloudinary
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// GET all videos (paginated)
router.get("/", requireAuth, async (req, res) => {
  try {
    const { grade, subject, search } = req.query;
    const limit  = Math.min(parseInt(req.query.limit)  || 12, 50);
    const page   = Math.max(parseInt(req.query.page)   || 1,  1);
    const offset = (page - 1) * limit;

    let q = `SELECT v.*, u.name as teacher_name,
      (SELECT COUNT(*) FROM video_views WHERE video_id = v.id) as view_count
      FROM videos v LEFT JOIN users u ON v.teacher_id = u.id WHERE 1=1`;
    const params = [];
    if (grade)   { params.push(grade);   q += ` AND v.grade = $${params.length}`; }
    if (subject) { params.push(subject); q += ` AND v.subject = $${params.length}`; }
    if (search)  { params.push(`%${search}%`); q += ` AND (v.title ILIKE $${params.length} OR v.subject ILIKE $${params.length})`; }

    // total count
    const countQ   = `SELECT COUNT(*) n FROM videos v WHERE 1=1` +
                     (grade   ? ` AND v.grade = $1`   : '') +
                     (subject ? ` AND v.subject = $${grade ? 2 : 1}` : '');
    const countRes = await pool.query(countQ, params);
    const total    = parseInt(countRes.rows[0].n);

    q += " ORDER BY v.created_at DESC";
    params.push(limit);  q += ` LIMIT $${params.length}`;
    params.push(offset); q += ` OFFSET $${params.length}`;

    const result = await pool.query(q, params);
    res.json({ videos: result.rows, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST upload video — streams to Cloudinary
router.post("/", requireAuth, upload.single("video"), async (req, res) => {
  try {
    const { title, subject, grade, assigned_to } = req.body;
    if (!req.file) return res.status(400).json({ error: "No video file uploaded" });

    // Upload video to Cloudinary with auto compression
    const videoResult = await uploadToCloudinary(req.file.buffer, {
      resource_type: "video",
      folder:        "eduapp/videos",
      quality:       "auto",        // Cloudinary picks best quality/size balance
      fetch_format:  "auto",        // Serves mp4/webm based on browser support
      transformation: [
        { width: 1280, crop: "limit" }, // Cap at 720p width
        { quality: "auto:good" },       // Good quality, smaller file
      ],
      // Auto-generate a thumbnail at the 1-second mark
      eager: [{ format: "jpg", transformation: [{ start_offset: "1", width: 640, crop: "limit" }] }],
      eager_async: false,
    });

    const videoUrl     = videoResult.secure_url;
    const thumbnailUrl = videoResult.eager?.[0]?.secure_url || null;

    const result = await pool.query(
      `INSERT INTO videos (title, url, thumbnail_url, subject, grade, teacher_id, assigned_to)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, videoUrl, thumbnailUrl, subject, grade, req.user.id,
       assigned_to ? JSON.parse(assigned_to) : []]
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
    await pool.query(
      `INSERT INTO logs (user_id, action, meta, timestamp)
       VALUES ($1, 'video_view', $2, now())`,
      [req.user.id, JSON.stringify({ video_id: req.params.id })]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE video
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin" && role !== "teacher")
      return res.status(403).json({ error: "Not allowed" });
    const vid = await pool.query("SELECT url FROM videos WHERE id = $1", [req.params.id]);
    if (!vid.rows[0]) return res.status(404).json({ error: "Not found" });

    // Delete from Cloudinary if it's a Cloudinary URL
    const url = vid.rows[0].url;
    if (url && url.includes("cloudinary.com")) {
      const parts  = url.split("/");
      const file   = parts[parts.length - 1].split(".")[0];
      const folder = "eduapp/videos";
      await cloudinary.uploader.destroy(`${folder}/${file}`, { resource_type: "video" }).catch(() => {});
    }

    await pool.query("DELETE FROM videos WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
