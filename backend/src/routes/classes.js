
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
        `SELECT c.*, u.name as teacher_name,
          (SELECT COUNT(*) FROM users WHERE class_id = c.id) as student_count
         FROM classes c
         LEFT JOIN users u ON c.teacher_id = u.id
         ORDER BY c.created_at DESC`
      );
    } else if (role === "teacher") {
      result = await pool.query(
        `SELECT c.*, u.name as teacher_name,
          (SELECT COUNT(*) FROM users WHERE class_id = c.id) as student_count
         FROM classes c
         LEFT JOIN users u ON c.teacher_id = u.id
         WHERE c.teacher_id = $1
         ORDER BY c.created_at DESC`,
        [id]
      );
    } else {
      result = await pool.query(
        `SELECT c.*, u.name as teacher_name
         FROM classes c
         LEFT JOIN users u ON c.teacher_id = u.id
         WHERE c.id = (SELECT class_id FROM users WHERE id = $1)`,
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
