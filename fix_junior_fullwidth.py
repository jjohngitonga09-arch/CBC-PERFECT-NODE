import os

path = r'C:\Users\pc\Downloads\eduapp\frontend\src\pages\student\JuniorBasics.jsx'

content = '''import { useState } from "react"

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

  return (
    <div style={{ padding: "0 0 40px" }}>

      {/* Fullscreen overlay - tap anywhere or Close to dismiss */}
      {fullscreen && (
        <div
          onClick={() => setFullscreen(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.97)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "12px",
            cursor: "zoom-out",
          }}
        >
          <img
            src={fullscreen.img}
            alt={fullscreen.label}
            style={{
              maxWidth: "100%",
              maxHeight: "88vh",
              objectFit: "contain",
              borderRadius: "10px",
            }}
          />
          <p style={{
            color: "#e5e7eb", marginTop: "14px",
            fontSize: "1rem", fontWeight: 700,
          }}>
            {fullscreen.label}
          </p>
          <button
            onClick={() => setFullscreen(null)}
            style={{
              marginTop: "10px", padding: "9px 32px",
              background: "#4f46e5", color: "#fff",
              border: "none", borderRadius: "10px",
              fontWeight: 700, fontSize: ".95rem", cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Page header */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{
          fontSize: "1.6rem", fontWeight: 800,
          color: "var(--text)", margin: "0 0 4px",
        }}>
          Junior Basics
        </h1>
        <p style={{ fontSize: ".875rem", color: "var(--sub)", margin: 0 }}>
          Tap any image to view it full screen
        </p>
      </div>

      {/* Full-width single column list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {BASICS.map((item) => (
          <div
            key={item.img}
            onClick={() => setFullscreen(item)}
            style={{
              cursor: "zoom-in",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              boxShadow: "var(--shadow)",
              transition: "transform 0.2s, box-shadow 0.2s",
              WebkitTapHighlightColor: "transparent",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "var(--shadow-hover)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "var(--shadow)"
            }}
          >
            {/* Image - full width, natural height, nothing cropped */}
            <img
              src={item.img}
              alt={item.label}
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />

            {/* Label bar below image */}
            <div style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              borderTop: "1px solid var(--border)",
            }}>
              <div>
                <p style={{
                  fontWeight: 700, color: "var(--text)",
                  margin: "0 0 2px", fontSize: "1rem",
                }}>
                  {item.label}
                </p>
                <p style={{ fontSize: ".78rem", color: "var(--sub)", margin: 0 }}>
                  {item.desc}
                </p>
              </div>
              <div style={{
                flexShrink: 0,
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.28)",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: ".75rem",
                fontWeight: 700,
                color: "#a5b4fc",
                whiteSpace: "nowrap",
              }}>
                Full Screen
              </div>
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

print("Done! JuniorBasics.jsx updated.")
print("Each image now shows full width with natural height — no more small boxes.")
print("Tap any image to open it fullscreen. Run: npm run dev")
