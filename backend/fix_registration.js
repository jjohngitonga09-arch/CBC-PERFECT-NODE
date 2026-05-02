const fs = require("fs");
const base = "C:/Users/pc/Downloads/eduapp/backend";

// ── 1. AUTH CONTROLLER (register + OTP verify + admin approve) ──
fs.writeFileSync(`${base}/src/controllers/authController.js`, `
require("dotenv").config();
const pool    = require("../db/pool");
const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");
const { sendOTP, sendWelcome } = require("./emailController");

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// ── REGISTER ──────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, username, email, phone, password, role, grade, national_id } = req.body;
    if (!name || !password || !role)
      return res.status(400).json({ error: "name, password and role are required" });

    // Check duplicates
    const dup = await pool.query(
      "SELECT id FROM users WHERE email=$1 OR username=$2 OR phone=$3",
      [email||null, username||null, phone||null]
    );
    if (dup.rows.length)
      return res.status(409).json({ error: "Email, username or phone already registered" });

    const hash   = await bcrypt.hash(password, 12);
    const status = "pending"; // ALL users start as pending

    const result = await pool.query(
      \`INSERT INTO users
        (name, username, email, phone, password_hash, role, grade, national_id, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, name, email, role, status\`,
      [name, username||null, email||null, phone||null, hash, role, grade||null, national_id||null, status]
    );

    const user = result.rows[0];

    // Send OTP if email provided (teachers and parents especially)
    if (email) {
      const otp     = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 15 * 60 * 1000);
      await pool.query(
        "UPDATE users SET otp=$1, otp_expires=$2 WHERE id=$3",
        [otp, expires, user.id]
      );
      // Send OTP email
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_SMTP_HOST,
        port: parseInt(process.env.MAIL_SMTP_PORT),
        secure: false,
        auth: { user: process.env.MAIL_EMAIL, pass: process.env.MAIL_PASSWORD }
      });
      await transporter.sendMail({
        from: '"EduApp" <' + process.env.MAIL_EMAIL + '>',
        to: email,
        subject: "Verify your EduApp account",
        html: \`
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
            <h2 style="color:#6366f1">Verify Your Email</h2>
            <p>Hello \${name},</p>
            <p>Your EduApp registration code is:</p>
            <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#6366f1;text-align:center;padding:24px;background:#f3f4f6;border-radius:8px;margin:16px 0">
              \${otp}
            </div>
            <p>This code expires in <strong>15 minutes</strong>.</p>
            <p>After verifying, your account will be reviewed by an admin before you can log in.</p>
            <p style="color:#9ca3af;font-size:12px">If you did not create this account, ignore this email.</p>
          </div>
        \`
      });
      return res.status(201).json({
        success: true,
        requiresOtp: true,
        userId: user.id,
        email: email,
        message: "OTP sent to " + email + ". Verify to complete registration."
      });
    }

    // No email — just pending, no OTP needed
    res.status(201).json({
      success: true,
      requiresOtp: false,
      userId: user.id,
      message: "Registration successful. Awaiting admin approval before you can log in."
    });
  } catch (e) {
    console.error("Register error:", e.message);
    res.status(500).json({ error: e.message });
  }
};

// ── VERIFY OTP (for registration email confirmation) ──────────────
exports.verifyRegistrationOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) return res.status(400).json({ error: "userId and otp required" });

    const result = await pool.query(
      "SELECT id, otp, otp_expires, name, email, status FROM users WHERE id=$1", [userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "User not found" });

    const user = result.rows[0];
    if (user.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    if (new Date() > new Date(user.otp_expires))
      return res.status(400).json({ error: "OTP expired. Please register again." });

    // Mark email verified, keep status=pending for admin approval
    await pool.query(
      "UPDATE users SET otp=NULL, otp_expires=NULL WHERE id=$1", [userId]
    );

    // Notify admins of new pending user
    const admins = await pool.query("SELECT id FROM users WHERE role='admin'");
    for (const admin of admins.rows) {
      await pool.query(
        \`INSERT INTO notifications (user_id, title, message, type)
         VALUES ($1, 'New User Pending Approval', $2, 'system')\`,
        [admin.id, user.name + " has registered and is awaiting your approval."]
      );
    }

    res.json({
      success: true,
      message: "Email verified! Your account is pending admin approval. You will be notified when approved."
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── RESEND OTP ────────────────────────────────────────────────────
exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await pool.query("SELECT id, name, email FROM users WHERE id=$1", [userId]);
    if (!result.rows[0]) return res.status(404).json({ error: "User not found" });

    const user = result.rows[0];
    if (!user.email) return res.status(400).json({ error: "No email on this account" });

    const otp     = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await pool.query("UPDATE users SET otp=$1, otp_expires=$2 WHERE id=$3", [otp, expires, user.id]);

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SMTP_HOST, port: parseInt(process.env.MAIL_SMTP_PORT),
      secure: false, auth: { user: process.env.MAIL_EMAIL, pass: process.env.MAIL_PASSWORD }
    });
    await transporter.sendMail({
      from: '"EduApp" <' + process.env.MAIL_EMAIL + '>',
      to: user.email,
      subject: "Your new EduApp verification code",
      html: \`<div style="font-family:Arial;padding:32px;max-width:500px;margin:auto;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#6366f1">New Verification Code</h2>
        <p>Hello \${user.name},</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#6366f1;text-align:center;padding:24px;background:#f3f4f6;border-radius:8px;margin:16px 0">\${otp}</div>
        <p>Expires in 15 minutes.</p></div>\`
    });

    res.json({ success: true, message: "New OTP sent to " + user.email });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { username, phone, password } = req.body;
    if (!password) return res.status(400).json({ error: "Password required" });

    let query, params;
    if (username) {
      query  = "SELECT * FROM users WHERE (username=$1 OR email=$1) AND status != 'deleted'";
      params = [username];
    } else if (phone) {
      const normalized = phone.startsWith("+") ? phone : "+254" + phone.replace(/^0/, "");
      query  = "SELECT * FROM users WHERE phone=$1 AND status != 'deleted'";
      params = [normalized];
    } else {
      return res.status(400).json({ error: "Username or phone required" });
    }

    const result = await pool.query(query, params);
    if (!result.rows[0]) return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];

    // Check OTP still pending (registered but not verified)
    if (user.otp) {
      return res.status(403).json({
        error: "Please verify your email first.",
        requiresOtp: true,
        userId: user.id
      });
    }

    // Check pending approval
    if (user.status === "pending") {
      return res.status(403).json({
        error: "Your account is pending admin approval. Please wait for confirmation."
      });
    }

    // Check blocked
    if (user.status === "blocked") {
      return res.status(403).json({ error: "Your account has been suspended. Contact admin." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // Update last online
    await pool.query("UPDATE users SET last_online=now() WHERE id=$1", [user.id]);

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email, grade: user.grade, avatar_url: user.avatar_url }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── ADMIN: GET PENDING USERS ───────────────────────────────────────
exports.getPendingUsers = async (req, res) => {
  try {
    const result = await pool.query(
      \`SELECT id, name, username, email, phone, role, grade, national_id, created_at
       FROM users WHERE status='pending' AND otp IS NULL
       ORDER BY created_at DESC\`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── ADMIN: APPROVE USER ───────────────────────────────────────────
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "UPDATE users SET status='active' WHERE id=$1 RETURNING id, name, email, role",
      [id]
    );
    if (!user.rows[0]) return res.status(404).json({ error: "User not found" });

    // Notify the user
    await pool.query(
      \`INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Account Approved!', 'Your account has been approved. You can now log in to EduApp.', 'system')\`,
      [id]
    );

    // Send welcome email
    if (user.rows[0].email) {
      await sendWelcome(id);
    }

    // Log it
    await pool.query(
      "INSERT INTO logs (type, user_id, action) VALUES ('admin', $1, 'approved user ' || $2)",
      [req.user?.id, id]
    );

    res.json({ success: true, user: user.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── ADMIN: REJECT USER ────────────────────────────────────────────
exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user = await pool.query("SELECT name, email FROM users WHERE id=$1", [id]);
    if (!user.rows[0]) return res.status(404).json({ error: "User not found" });

    await pool.query("UPDATE users SET status='blocked' WHERE id=$1", [id]);

    // Notify user
    await pool.query(
      \`INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Registration Rejected', $2, 'system')\`,
      [id, reason || "Your registration was not approved. Contact admin for more info."]
    );

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
`);
console.log("✅ authController.js written");

// ── 2. AUTH ROUTES ────────────────────────────────────────────────
fs.writeFileSync(`${base}/src/routes/auth.js`, `
const express    = require("express");
const router     = express.Router();
const ctrl       = require("../controllers/authController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.post("/register",            ctrl.register);
router.post("/verify-otp",          ctrl.verifyRegistrationOtp);
router.post("/resend-otp",          ctrl.resendOtp);
router.post("/login",               ctrl.login);

// Password reset OTP (from emailController)
const emailCtrl = require("../controllers/emailController");
router.post("/forgot-password",     emailCtrl.sendOTP);
router.post("/reset-password",      emailCtrl.verifyOTP);

// Admin user management
router.get("/admin/pending",              requireAuth, requireAdmin, ctrl.getPendingUsers);
router.put("/admin/approve/:id",          requireAuth, requireAdmin, ctrl.approveUser);
router.put("/admin/reject/:id",           requireAuth, requireAdmin, ctrl.rejectUser);

module.exports = router;
`);
console.log("✅ auth routes written");

// ── 3. PATCH MIDDLEWARE to add requireAdmin ───────────────────────
const authMwPath = `${base}/src/middleware/auth.js`;
let mw = fs.readFileSync(authMwPath, "utf8");
if (!mw.includes("requireAdmin")) {
  mw += `
exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ error: "Admin only" });
  next();
};
`;
  fs.writeFileSync(authMwPath, mw);
  console.log("✅ requireAdmin added to middleware");
} else {
  console.log("ℹ️  requireAdmin already exists");
}

// ── 4. REGISTER /auth in app.js ───────────────────────────────────
const appPath = `${base}/src/app.js`;
let app = fs.readFileSync(appPath, "utf8");
if (!app.includes("'/auth'")) {
  app = app.replace(
    "module.exports = app",
    `app.use('/auth', require('./routes/auth'));\nmodule.exports = app`
  );
  fs.writeFileSync(appPath, app);
  console.log("✅ /auth registered in app.js");
}

console.log(`
════════════════════════════════════
BACKEND DONE
════════════════════════════════════
API endpoints ready:
  POST /auth/register
  POST /auth/verify-otp
  POST /auth/resend-otp
  POST /auth/login
  POST /auth/forgot-password
  POST /auth/reset-password
  GET  /auth/admin/pending
  PUT  /auth/admin/approve/:id
  PUT  /auth/admin/reject/:id

NEXT: Save the file and run it
`);