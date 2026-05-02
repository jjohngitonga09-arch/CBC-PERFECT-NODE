
require("dotenv").config();
const nodemailer = require("nodemailer");
const pool = require("../db/pool");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SMTP_HOST,
  port: parseInt(process.env.MAIL_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP for password reset
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await pool.query("SELECT id, name FROM users WHERE email = $1", [email]);
    if (!user.rows[0]) return res.status(404).json({ error: "No account with that email" });

    const otp = generateOTP();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await pool.query(
      "UPDATE users SET otp=$1, otp_expires=$2 WHERE email=$3",
      [otp, expires, email]
    );

    await transporter.sendMail({
      from: '"EduApp" <' + process.env.MAIL_EMAIL + '>',
      to: email,
      subject: "Your EduApp Password Reset Code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#6366f1">EduApp Password Reset</h2>
          <p>Hello ${user.rows[0].name},</p>
          <p>Your one-time password reset code is:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#6366f1;text-align:center;padding:24px;background:#f3f4f6;border-radius:8px;margin:16px 0">
            ${otp}
          </div>
          <p>This code expires in <strong>15 minutes</strong>.</p>
          <p style="color:#9ca3af;font-size:12px">If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    res.json({ success: true, message: "OTP sent to " + email });
  } catch (e) {
    console.error("sendOTP error:", e.message);
    res.status(500).json({ error: "Failed to send email: " + e.message });
  }
};

// Verify OTP and reset password
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ error: "email, otp, and newPassword required" });

    const user = await pool.query(
      "SELECT id, otp, otp_expires FROM users WHERE email=$1",
      [email]
    );
    if (!user.rows[0]) return res.status(404).json({ error: "User not found" });

    const { otp: savedOtp, otp_expires } = user.rows[0];
    if (savedOtp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (new Date() > new Date(otp_expires)) return res.status(400).json({ error: "OTP expired" });

    const bcrypt = require("bcrypt");
    const hash = await bcrypt.hash(newPassword, 12);

    await pool.query(
      "UPDATE users SET password_hash=$1, otp=NULL, otp_expires=NULL WHERE email=$2",
      [hash, email]
    );

    res.json({ success: true, message: "Password reset successful" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Send welcome email on registration
exports.sendWelcome = async (userId) => {
  try {
    const user = await pool.query("SELECT name, email FROM users WHERE id=$1", [userId]);
    if (!user.rows[0]?.email) return;
    await transporter.sendMail({
      from: '"EduApp" <' + process.env.MAIL_EMAIL + '>',
      to: user.rows[0].email,
      subject: "Welcome to EduApp!",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#6366f1">Welcome to EduApp, ${user.rows[0].name}!</h2>
          <p>Your account has been created successfully.</p>
          <p>You can now log in and start learning.</p>
          <a href="http://localhost:5173" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Go to EduApp</a>
        </div>
      `
    });
  } catch (e) {
    console.error("Welcome email error:", e.message);
  }
};
