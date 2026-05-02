const fs = require("fs");
const path = require("path");

const base = "C:/Users/pc/Downloads/eduapp/backend";

// ── 1. UPDATE .env ─────────────────────────────────────────────
const envPath = `${base}/.env`;
let env = fs.readFileSync(envPath, "utf8");

const newVars = {
  MPESA_CONSUMER_KEY: "r9qIdlRxUUcSKDbYci5SrVHlJsbRnKeFGD4VEI3rAWc0Mj5t",
  MPESA_CONSUMER_SECRET: "AU6DAVCDMPJ8PjXT7AGBvfZ7TZcT1GhvfoJJRufGDJyIw87zt12AA7RahRVn1wHQ",
  MPESA_SHORTCODE: "174379",
  MPESA_PASSKEY: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
  MPESA_CALLBACK_URL: "https://allows-markers-classified-reaches.trycloudflare.com/mpesa/callback/",
  MPESA_ENV: "sandbox",
  MAIL_EMAIL: "jjjonexes@gmail.com",
  MAIL_PASSWORD: "hjwwvhogdtqiytwx",
  MAIL_SMTP_HOST: "smtp.gmail.com",
  MAIL_SMTP_PORT: "587",
  AT_USERNAME: "sandbox",
  AT_API_KEY: "atsk_6b318101a8f5f2bae9d116aa18736b987405c87ea59391f2fe45caff852eb29c1ffb3f41",
  AT_SENDER_ID: "CBC"
};

for (const [key, val] of Object.entries(newVars)) {
  if (env.includes(key + "=")) {
    env = env.replace(new RegExp(`${key}=.*`, "g"), `${key}=${val}`);
  } else {
    env += `\n${key}=${val}`;
  }
}
fs.writeFileSync(envPath, env);
console.log("✅ .env updated");

// ── 2. MPESA CONTROLLER ────────────────────────────────────────
fs.mkdirSync(`${base}/src/controllers`, { recursive: true });
fs.writeFileSync(`${base}/src/controllers/mpesaController.js`, `
require("dotenv").config();
const axios = require("axios");
const pool = require("../db/pool");

const {
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_CALLBACK_URL,
  MPESA_ENV
} = process.env;

const baseURL = MPESA_ENV === "sandbox"
  ? "https://sandbox.safaricom.co.ke"
  : "https://api.safaricom.co.ke";

// Get OAuth token
async function getToken() {
  const creds = Buffer.from(MPESA_CONSUMER_KEY + ":" + MPESA_CONSUMER_SECRET).toString("base64");
  const res = await axios.get(baseURL + "/oauth/v1/generate?grant_type=client_credentials", {
    headers: { Authorization: "Basic " + creds }
  });
  return res.data.access_token;
}

// STK Push — triggers payment prompt on phone
exports.stkPush = async (req, res) => {
  try {
    const { phone, amount, plan, userId } = req.body;
    if (!phone || !amount) return res.status(400).json({ error: "phone and amount required" });

    const token = await getToken();
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
    const password = Buffer.from(MPESA_SHORTCODE + MPESA_PASSKEY + timestamp).toString("base64");

    // Normalize phone: 07xx → 2547xx
    const normalizedPhone = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone;

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: normalizedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: "EduApp-" + (plan || "subscription"),
      TransactionDesc: "EduApp subscription payment"
    };

    const response = await axios.post(
      baseURL + "/mpesa/stkpush/v1/processrequest",
      payload,
      { headers: { Authorization: "Bearer " + token } }
    );

    // Save pending transaction
    await pool.query(
      \`INSERT INTO subscriptions (user_id, plan, amount, status, plan_id)
       VALUES ($1, $2, $3, 'pending', $4)
       ON CONFLICT (user_id) DO UPDATE
       SET plan=$2, amount=$3, status='pending', plan_id=$4\`,
      [userId, plan || "standard", amount, plan || "standard"]
    );

    res.json({
      success: true,
      CheckoutRequestID: response.data.CheckoutRequestID,
      message: "Payment prompt sent to " + normalizedPhone
    });
  } catch (e) {
    console.error("STK Push error:", e.response?.data || e.message);
    res.status(500).json({ error: e.response?.data?.errorMessage || e.message });
  }
};

// Callback — Safaricom calls this after payment
exports.callback = async (req, res) => {
  try {
    const body = req.body?.Body?.stkCallback;
    if (!body) return res.sendStatus(200);

    const code = body.ResultCode;
    if (code === 0) {
      // Payment successful
      const items = body.CallbackMetadata?.Item || [];
      const get = (name) => items.find(i => i.Name === name)?.Value;

      const amount = get("Amount");
      const mpesaRef = get("MpesaReceiptNumber");
      const phone = String(get("PhoneNumber"));

      // Find user by phone and activate subscription
      const user = await pool.query(
        "SELECT id FROM users WHERE phone LIKE $1",
        ["%" + phone.slice(-9)]
      );

      if (user.rows[0]) {
        const uid = user.rows[0].id;
        const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await pool.query(
          \`UPDATE subscriptions
           SET status='active', last_payment_date=now(), expiry_date=$1
           WHERE user_id=$2\`,
          [expiry, uid]
        );
        await pool.query(
          \`INSERT INTO notifications (user_id, title, message, type)
           VALUES ($1, 'Payment Confirmed', 'Your subscription is now active. Ref: ' || $2, 'payment')\`,
          [uid, mpesaRef]
        );
        console.log("Payment confirmed for user:", uid, "Ref:", mpesaRef);
      }
    } else {
      console.log("Payment failed/cancelled. Code:", code, body.ResultDesc);
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("Callback error:", e.message);
    res.sendStatus(200); // Always return 200 to Safaricom
  }
};

// Check transaction status
exports.checkStatus = async (req, res) => {
  try {
    const token = await getToken();
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
    const password = Buffer.from(MPESA_SHORTCODE + MPESA_PASSKEY + timestamp).toString("base64");

    const response = await axios.post(
      baseURL + "/mpesa/stkpushquery/v1/query",
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: req.params.checkoutId
      },
      { headers: { Authorization: "Bearer " + token } }
    );
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
`);
console.log("✅ mpesaController.js written");

// ── 3. MPESA ROUTE ─────────────────────────────────────────────
fs.writeFileSync(`${base}/src/routes/mpesa.js`, `
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/mpesaController");
const { requireAuth } = require("../middleware/auth");

router.post("/pay",      requireAuth, ctrl.stkPush);
router.post("/callback", ctrl.callback);           // public — Safaricom calls this
router.get("/status/:checkoutId", requireAuth, ctrl.checkStatus);

module.exports = router;
`);
console.log("✅ mpesa route written");

// ── 4. EMAIL + OTP CONTROLLER ──────────────────────────────────
fs.writeFileSync(`${base}/src/controllers/emailController.js`, `
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
      html: \`
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#6366f1">EduApp Password Reset</h2>
          <p>Hello \${user.rows[0].name},</p>
          <p>Your one-time password reset code is:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#6366f1;text-align:center;padding:24px;background:#f3f4f6;border-radius:8px;margin:16px 0">
            \${otp}
          </div>
          <p>This code expires in <strong>15 minutes</strong>.</p>
          <p style="color:#9ca3af;font-size:12px">If you did not request this, please ignore this email.</p>
        </div>
      \`
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
      html: \`
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#6366f1">Welcome to EduApp, \${user.rows[0].name}!</h2>
          <p>Your account has been created successfully.</p>
          <p>You can now log in and start learning.</p>
          <a href="http://localhost:5173" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Go to EduApp</a>
        </div>
      \`
    });
  } catch (e) {
    console.error("Welcome email error:", e.message);
  }
};
`);
console.log("✅ emailController.js written");

// ── 5. AUTH ROUTE for OTP ──────────────────────────────────────
fs.writeFileSync(`${base}/src/routes/otp.js`, `
const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../controllers/emailController");

router.post("/send",   sendOTP);
router.post("/verify", verifyOTP);

module.exports = router;
`);
console.log("✅ otp route written");

// ── 6. REGISTER /mpesa and /otp in app.js ─────────────────────
const appPath = `${base}/src/app.js`;
let app = fs.readFileSync(appPath, "utf8");

if (!app.includes("/mpesa")) {
  app = app.replace(
    "module.exports = app",
    `app.use('/mpesa', require('./routes/mpesa'));
app.use('/otp',   require('./routes/otp'));
module.exports = app`
  );
  fs.writeFileSync(appPath, app);
  console.log("✅ registered /mpesa and /otp in app.js");
} else {
  console.log("ℹ️  /mpesa already registered in app.js");
}

console.log("\n════════════════════════════════════");
console.log("ALL DONE");
console.log("════════════════════════════════════");
console.log("NEXT STEPS:");
console.log("1. npm install nodemailer axios  (in backend folder)");
console.log("2. npm run dev");
console.log("3. Test OTP:  POST /otp/send  { email }");
console.log("4. Test pay:  POST /mpesa/pay { phone, amount, plan, userId }");