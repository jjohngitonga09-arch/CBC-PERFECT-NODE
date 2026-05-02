const fs = require("fs");
const path = "src/controllers/authController.js";
let content = fs.readFileSync(path, "utf8");

const oldBlock = `    // Admins are NEVER locked out — just return wrong password
      if (user.role === "admin") {
        await auditLog({ action:"login_failed_admin", userId:user.id, userName:user.name, role:user.role, ip });
        return res.status(401).json({ error: "Invalid password." });
      }`;

const newBlock = `    // Admins: no lockout but tracked + alerted + delayed
      if (user.role === "admin") {
        const adminAttempts = (user.failed_login_attempts || 0) + 1;
        await pool.query(
          "UPDATE users SET failed_login_attempts=$1 WHERE id=$2",
          [adminAttempts, user.id]
        );
        await auditLog({ action:"login_failed_admin", userId:user.id, userName:user.name, role:user.role, ip, meta:{ adminAttempts } });

        // Alert admin via notification after 3 failed attempts
        if (adminAttempts >= 3) {
          const title = "Security Alert: Failed Admin Login";
          const msg   = "Someone failed to login as admin " + adminAttempts + " times from IP: " + (ip || "unknown");
          await pool.query(
            "INSERT INTO notifications (user_id, title, message, type) SELECT id, $1, $2, 'system' FROM users WHERE role='admin'",
            [title, msg]
          ).catch(() => {});
        }

        // Artificial delay — slows brute force (caps at 5 seconds)
        const delay = Math.min(adminAttempts * 1000, 5000);
        await new Promise(r => setTimeout(r, delay));

        return res.status(401).json({ error: "Invalid password." });
      }`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync(path, content, "utf8");
  console.log("✅ Admin brute force protection added!");
} else {
  console.log("❌ Old block not found — may already be patched or text differs");
  // Show what's around the admin check for debugging
  const idx = content.indexOf("login_failed_admin");
  if (idx > -1) {
    console.log("Found login_failed_admin at index", idx);
    console.log("Context:\n", content.substring(idx - 100, idx + 300));
  }
}
