import os

notes_path = r'C:\Users\pc\Downloads\eduapp\frontend\src\pages\student\Notes.jsx'

# Read current file
with open(notes_path, encoding='utf-8') as f:
    content = f.read()

# ── ONLY change: replace the ☰ button with a labelled "Subjects" button ──
old = '''          <button aria-label="Open menu" onClick={() => setSidebarOpen(true)}
            style={{ background:'var(--surface,#1f2937)', border:'none', borderRadius:'10px',
              color:'var(--text,#f9fafb)', width:'40px', height:'40px', cursor:'pointer',
              fontSize:'1.1rem', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            ☰
          </button>'''

new = '''          <button aria-label="Switch subject" onClick={() => setSidebarOpen(true)}
            style={{ background:'var(--surface,#1f2937)', border:'1px solid var(--border,#374151)',
              borderRadius:'10px', color:'var(--text,#f9fafb)', height:'40px', padding:'0 12px',
              cursor:'pointer', fontSize:'.78rem', fontWeight:700, flexShrink:0,
              display:'flex', alignItems:'center', gap:'6px', whiteSpace:'nowrap' }}>
            <span style={{ fontSize:'.95rem' }}>📚</span> Subjects
          </button>'''

if old in content:
    content = content.replace(old, new)
    with open(notes_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Done! Notes.jsx patched.")
    print("  - ☰ hamburger replaced with  Subjects button")
    print("  - No other code changed")
else:
    print("ERROR: Could not find the target button.")
    print("The button text may have changed. No file was modified.")
