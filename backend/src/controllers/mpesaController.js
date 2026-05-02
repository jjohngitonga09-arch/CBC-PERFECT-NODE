
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
      `INSERT INTO subscriptions (user_id, plan, amount, status, plan_id)
       VALUES ($1, $2, $3, 'pending', $4)
       ON CONFLICT (user_id) DO UPDATE
       SET plan=$2, amount=$3, status='pending', plan_id=$4`,
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
          `UPDATE subscriptions
           SET status='active', last_payment_date=now(), expiry_date=$1
           WHERE user_id=$2`,
          [expiry, uid]
        );
        await pool.query(
          `INSERT INTO notifications (user_id, title, message, type)
           VALUES ($1, 'Payment Confirmed', 'Your subscription is now active. Ref: ' || $2, 'payment')`,
          [uid, mpesaRef]
        );
        // Auto-insert payment message for admin tracking
        await pool.query(
          `INSERT INTO payment_messages(id,user_id,user_name,user_role,plan_id,plan_name,amount,phone,mpesa_ref,message,status)
           SELECT gen_random_uuid(),s.user_id,u.name,u.role,s.plan_id,s.plan_name,s.amount,$1,$2,'Auto-confirmed via M-Pesa','confirmed'
           FROM subscriptions s JOIN users u ON u.id=s.user_id WHERE s.user_id=$3 LIMIT 1`,
          [String(get('PhoneNumber')||''), mpesaRef, uid]
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
