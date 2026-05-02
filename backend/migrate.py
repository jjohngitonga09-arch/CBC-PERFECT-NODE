import subprocess

cmds = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50);",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';",
    "CREATE TABLE IF NOT EXISTS unlock_requests (id SERIAL PRIMARY KEY, name VARCHAR(200), phone VARCHAR(20), reason TEXT, role VARCHAR(20) DEFAULT 'student', status VARCHAR(20) DEFAULT 'pending', created_at TIMESTAMP DEFAULT NOW());",
]

for cmd in cmds:
    r = subprocess.run(
        ['psql', '-U', 'postgres', '-d', 'eduapp', '-c', cmd],
        capture_output=True, text=True
    )
    print(cmd[:60], '->', r.stdout.strip() or r.stderr.strip())
