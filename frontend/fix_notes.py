import os

file_path = r"C:\Users\pc\OneDrive\Desktop\eduapp\frontend\src\pages\student\Notes.jsx"

if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Verify we are hitting the correct block using line indices (0-indexed)
    # Line 345 is index 344, line 356 is index 355
    target_check = "".join(lines[344:347])
    if "margin:0, lineHeight:1.75" in target_check or "card.content" in target_check:
        
        # Define the exact corrected block to insert
        corrected_block = """                    ) : (
                      <>
                        <p style={{ color:'var(--text,var(--text))', fontWeight:500, fontSize:'.875rem',
                          margin:0, lineHeight:1.75, whiteSpace:'pre-wrap' }}>{card.content}</p>
                        {card.images && (
                          <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'16px' }}>
                            {card.images.map((src, idx) => (
                              <img key={idx} src={src} alt={`${card.title} ${idx+1}`}
                                style={{ width:'100%', borderRadius:'10px', border:'1px solid var(--border,var(--surface-hover))' }} />
                            ))}
                          </div>
                        )}
                      </>
                    )\n"""

        # Replace lines 345 to 356 (indices 344 to 356)
        lines[344:356] = [corrected_block]

        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
            
        print("✅ Success: Notes.jsx updated safely with React Fragments.")
    else:
        print("⚠️ Warning: Line contents did not match expectations. No changes made.")
else:
    print(f"❌ Error: File not found at {file_path}")