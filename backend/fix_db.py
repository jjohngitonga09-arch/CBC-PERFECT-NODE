import subprocess, sys

sql = """
-- Check existing columns
SELECT column_name FROM information_schema.columns WHERE table_name='users';
"""

result = subprocess.run(
    ['psql', '-U', 'postgres', '-d', 'eduapp', '-c', sql],
    capture_output=True, text=True
)
print(result.stdout)
print(result.stderr)
