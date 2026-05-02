const { query } = require('../config/db');
(async () => {
  try {
    await query("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS dismissed_by TEXT[] DEFAULT '{}'");
    console.log('dismissed_by column added OK');
  } catch(e){ console.error(e.message); }
  process.exit(0);
})();