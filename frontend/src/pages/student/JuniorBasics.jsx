import { useState } from "react"
import useAuthStore from "../../store/authStore"

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
  const grade = useAuthStore(s => s.grade)
  const GRADE_NUM = { PP1:0, PP2:0, 'Grade 1':1, 'Grade 2':2, 'Grade 3':3, 'Grade 4':4, 'Grade 5':5, 'Grade 6':6, 'Grade 7':7, 'Grade 8':8, 'Grade 9':9 }
  const gradeNum = GRADE_NUM[grade] ?? 1
  if (gradeNum >= 4) return (
    <div style={{ padding:'40px 20px', textAlign:'center' }}>
      <p style={{ fontSize:'2.5rem', margin:'0 0 12px' }}>📚</p>
      <h2 style={{ color:'var(--text)', margin:'0 0 8px' }}>Junior Basics is for Grades 1–3</h2>
      <p style={{ color:'var(--sub)', margin:0 }}>This section has foundational materials for younger learners.</p>
    </div>
  )
  const [fsIdx,  setFsIdx]  = useState(null)
  const [failed, setFailed] = useState({})

  const item    = fsIdx !== null ? BASICS[fsIdx] : null
  const hasPrev = fsIdx > 0
  const hasNext = fsIdx !== null && fsIdx < BASICS.length - 1

  return (
    <div style={{ padding: "0 0 40px" }}>

      {/* ── FULLSCREEN OVERLAY ── */}
      {item && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#000", display: "flex", flexDirection: "column",
        }}>
          {/* nav bar */}
          <div style={{
            flexShrink: 0, display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "10px 12px", gap: "8px",
            background: "rgba(0,0,0,0.92)", borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            <button
              onClick={() => setFsIdx(i => i - 1)} disabled={!hasPrev}
              style={{
                background: hasPrev ? "rgba(255,255,255,0.1)" : "transparent",
                color: hasPrev ? "#f9fafb" : "#374151",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                padding: "7px 14px", fontWeight: 700, fontSize: ".8rem",
                cursor: hasPrev ? "pointer" : "default", flexShrink: 0,
              }}>
              &larr; Prev
            </button>

            <div style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
              <p style={{ color: "#f9fafb", fontWeight: 700, margin: 0, fontSize: ".88rem",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.label}
              </p>
              <p style={{ color: "#6b7280", fontSize: ".65rem", margin: 0 }}>
                {fsIdx + 1} of {BASICS.length} &middot; Pinch to zoom
              </p>
            </div>

            <button
              onClick={() => setFsIdx(i => i + 1)} disabled={!hasNext}
              style={{
                background: hasNext ? "#6366f1" : "transparent",
                color: hasNext ? "#fff" : "#374151",
                border: "none", borderRadius: "8px",
                padding: "7px 14px", fontWeight: 700, fontSize: ".8rem",
                cursor: hasNext ? "pointer" : "default", flexShrink: 0,
              }}>
              Next &rarr;
            </button>

            <button
              onClick={() => setFsIdx(null)}
              style={{
                background: "#ef4444", color: "#fff", border: "none",
                borderRadius: "8px", padding: "7px 12px",
                fontWeight: 700, fontSize: ".85rem", cursor: "pointer", flexShrink: 0,
              }}>
              &times;
            </button>
          </div>

          {/* image fills remaining screen */}
          <div style={{
            flex: 1, display: "flex",
            alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            <img
              src={item.img} alt={item.label}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", touchAction: "pinch-zoom" }}
            />
          </div>
        </div>
      )}

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>
          Junior Basics
        </h1>
        <p style={{ fontSize: ".875rem", color: "var(--sub)", margin: 0 }}>
          Tap any card &middot; Use Prev / Next to browse all &middot; Pinch to zoom
        </p>
      </div>

      {/* ── FULL-WIDTH IMAGE LIST ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {BASICS.map((b, idx) => (
          <div
            key={b.img}
            onClick={() => !failed[b.img] && setFsIdx(idx)}
            style={{
              borderRadius: "16px", overflow: "hidden",
              border: "1px solid var(--border)", background: "var(--surface)",
              boxShadow: "var(--shadow)", cursor: failed[b.img] ? "default" : "zoom-in",
              transition: "transform 0.2s, box-shadow 0.2s",
              WebkitTapHighlightColor: "transparent",
            }}
            onMouseEnter={e => { if (!failed[b.img]) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-hover)" } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow)" }}
          >
            {failed[b.img] ? (
              <div style={{ minHeight: "160px", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", background: "#1a2234", gap: "8px", padding: "24px" }}>
                <span style={{ fontSize: "2.5rem" }}>&#128444;</span>
                <p style={{ color: "#6b7280", fontSize: ".85rem", margin: 0, textAlign: "center" }}>Image not found</p>
                <p style={{ color: "#4b5563", fontSize: ".72rem", margin: 0, textAlign: "center" }}>
                  Place <strong style={{ color: "#818cf8" }}>{b.img.split("/").pop()}</strong> in <strong style={{ color: "#818cf8" }}>public/basics/</strong>
                </p>
              </div>
            ) : (
              <img
                src={b.img} alt={b.label} loading="lazy"
                onError={() => setFailed(f => ({ ...f, [b.img]: true }))}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )}
            <div style={{
              padding: "12px 16px", display: "flex",
              alignItems: "center", justifyContent: "space-between", gap: "12px",
              borderTop: "1px solid var(--border)",
            }}>
              <div>
                <p style={{ fontWeight: 700, color: "var(--text)", margin: "0 0 2px", fontSize: "1rem" }}>{b.label}</p>
                <p style={{ fontSize: ".78rem", color: "var(--sub)", margin: 0 }}>{b.desc}</p>
              </div>
              {!failed[b.img] && (
                <div style={{
                  flexShrink: 0, background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.28)", borderRadius: "8px",
                  padding: "6px 14px", fontSize: ".75rem", fontWeight: 700,
                  color: "#a5b4fc", whiteSpace: "nowrap",
                }}>
                  Open
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
