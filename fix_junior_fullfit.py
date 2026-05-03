import os

path = r'C:\Users\pc\Downloads\eduapp\frontend\src\pages\student\JuniorBasics.jsx'

content = r'''import { useState } from "react"

const BASICS = [
  { img: "/basics/1-100.png",               label: "Numbers 1-100",      desc: "Count and recognise numbers" },
  { img: "/basics/Alphabetics.png",          label: "Alphabetics",        desc: "Learn the alphabet A-Z" },
  { img: "/basics/englishsounds.png",        label: "English Sounds",     desc: "Phonics and letter sounds" },
  { img: "/basics/vowels.png",               label: "Vowels",             desc: "A E I O U - vowel practice" },
  { img: "/basics/2dshapes.png",             label: "2D Shapes",          desc: "Circles, squares and more" },
  { img: "/basics/multiplication.png",       label: "Multiplication",     desc: "Times tables made easy" },
  { img: "/basics/numbers100withwords.png",  label: "Numbers with Words", desc: "Numbers written as words" },
]

export default function JuniorBasics() {
  const [fullscreen, setFullscreen] = useState(null)
  const [failed, setFailed]         = useState({})

  return (
    <div style={{ padding: "0 0 40px" }}>

      {/* ─── FULLSCREEN OVERLAY ─── */}
      {fullscreen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#000",
          display: "flex",
          flexDirection: "column",
        }}>

          {/* top bar */}
          <div style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: "rgba(0,0,0,0.9)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div>
              <p style={{ color: "#f9fafb", fontWeight: 700, margin: 0, fontSize: ".95rem" }}>
                {fullscreen.label}
              </p>
              <p style={{ color: "#6b7280", fontSize: ".72rem", margin: 0 }}>
                Pinch to zoom in on small text
              </p>
            </div>
            <button
              onClick={() => setFullscreen(null)}
              style={{
                background: "#ef4444", color: "#fff", border: "none",
                borderRadius: "8px", padding: "8px 20px",
                fontWeight: 700, fontSize: ".875rem", cursor: "pointer",
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* image fills ALL remaining height and width — no black gap */}
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}>
            <img
              src={fullscreen.img}
              alt={fullscreen.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                touchAction: "pinch-zoom",
              }}
            />
          </div>
        </div>
      )}

      {/* ─── PAGE HEADER ─── */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>
          ⭐ Junior Basics
        </h1>
        <p style={{ fontSize: ".875rem", color: "var(--sub)", margin: 0 }}>
          Tap any card to open full screen · Pinch to zoom in
        </p>
      </div>

      {/* ─── FULL-WIDTH IMAGE LIST ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {BASICS.map((item) => (
          <div
            key={item.img}
            onClick={() => !failed[item.img] && setFullscreen(item)}
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              boxShadow: "var(--shadow)",
              cursor: failed[item.img] ? "default" : "zoom-in",
              transition: "transform 0.2s, box-shadow 0.2s",
              WebkitTapHighlightColor: "transparent",
            }}
            onMouseEnter={e => {
              if (!failed[item.img]) {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "var(--shadow-hover)"
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "var(--shadow)"
            }}
          >
            {failed[item.img] ? (
              <div style={{
                minHeight: "160px", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "#1a2234", gap: "8px", padding: "24px",
              }}>
                <span style={{ fontSize: "2.5rem" }}>🖼️</span>
                <p style={{ color: "#6b7280", fontSize: ".85rem", margin: 0, textAlign: "center" }}>
                  Image not found
                </p>
                <p style={{ color: "#4b5563", fontSize: ".72rem", margin: 0, textAlign: "center" }}>
                  Place <strong style={{ color: "#818cf8" }}>
                    {item.img.split("/").pop()}
                  </strong> in <strong style={{ color: "#818cf8" }}>public/basics/</strong>
                </p>
              </div>
            ) : (
              <img
                src={item.img}
                alt={item.label}
                loading="lazy"
                onError={() => setFailed(f => ({ ...f, [item.img]: true }))}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            )}

            {/* label bar */}
            <div style={{
              padding: "12px 16px",
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: "12px",
              borderTop: "1px solid var(--border)",
            }}>
              <div>
                <p style={{ fontWeight: 700, color: "var(--text)", margin: "0 0 2px", fontSize: "1rem" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: ".78rem", color: "var(--sub)", margin: 0 }}>
                  {item.desc}
                </p>
              </div>
              {!failed[item.img] && (
                <div style={{
                  flexShrink: 0,
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.28)",
                  borderRadius: "8px", padding: "6px 14px",
                  fontSize: ".75rem", fontWeight: 700, color: "#a5b4fc",
                  whiteSpace: "nowrap",
                }}>
                  🔍 Full Screen
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
'''

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! JuniorBasics.jsx fixed.")
print("")
print("  Full Screen: image now fills the ENTIRE screen - no black gap below")
print("  Page view  : images fill full card width as before")
print("  Pinch zoom : works on phone to zoom into small text")
print("")
print("Run: npm run dev")
