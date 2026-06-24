file_path = r"C:\Users\pc\OneDrive\Desktop\eduapp\frontend\src\pages\student\Notes.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target exactly that broken segment where the paren is missing its curly brace
broken_part = """                        <div style={{ display:'flex', flexDirection:'column', gap:...
                               <img key={idx} src={src} alt={`${card.title} ${idx+1}`}
                                 style={{ width:'100%', borderRadius:'10px', border:'...
                             ))}
                           </div>
                         )}
                       </>
                     )
                   </div>"""

# Replace it with the structurally solid version (adding the '}' back to line 358)
corrected_part = """                        {card.images && (
                          <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'16px' }}>
                            {card.images.map((src, idx) => (
                              <img key={idx} src={src} alt={`${card.title} ${idx+1}`}
                                style={{ width:'100%', borderRadius:'10px', border:'1px solid var(--border,var(--surface-hover))' }} />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>"""

# Fallback: if the ellipses columns caused an absolute mismatch in text, we do a looser clean up
if broken_part not in content:
    # Just directly look for the broken closing section from line 356 to 359
    content = content.replace("</>\n                     )\n                   </div>", "</>\n                    )}\n                  </div>")
else:
    content = content.replace(broken_part, corrected_part)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Line 358 closing brace has been restored!")