import React from 'react';

// ---------------------------------------------------------------------------
// Color palette — matches the accent colors already used elsewhere in the
// app (amber #f59e0b, green #16a34a, blue #3b82f6) plus a few extra ramps
// for diagrams that need more than three categories.
// ---------------------------------------------------------------------------
const PALETTE = {
  amber:  { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
  green:  { bg: '#f0fdf4', border: '#16a34a', text: '#166534' },
  blue:   { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
  purple: { bg: '#f5f3ff', border: '#7c3aed', text: '#5b21b6' },
  coral:  { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
  teal:   { bg: '#f0fdfa', border: '#0d9488', text: '#115e59' },
  gray:   { bg: 'var(--bg)', border: '#64748b', text: 'inherit' },
};

const colorOf = (name) => PALETTE[name] || PALETTE.gray;

// ---------------------------------------------------------------------------
// TreeDiagram — one root box branching into 2-5 labeled categories, each
// optionally with a short bullet list. Replaces the broken ASCII trees like:
//   [ THE PARTS OF SPEECH TREE ]
//        ?
//   [ NOUN ] [ VERB ] [ MODIFIERS ]
// ---------------------------------------------------------------------------
export function TreeDiagram({ title, color = 'purple', branches = [] }) {
  const root = colorOf(color);
  return (
    <div style={{ margin: '16px 0' }}>
      <div style={{
        background: root.bg, border: `1px solid ${root.border}`, color: root.text,
        borderRadius: '8px', padding: '10px 18px', fontWeight: 700,
        textAlign: 'center', maxWidth: '320px', margin: '0 auto',
      }}>
        {title}
      </div>
      <div style={{ width: '2px', height: '16px', background: root.border, margin: '0 auto', opacity: 0.5 }} />
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center',
      }}>
        {branches.map((b, i) => {
          const c = colorOf(b.color);
          return (
            <div key={i} style={{
              background: c.bg, borderTop: `4px solid ${c.border}`, color: c.text,
              borderRadius: '0 0 8px 8px', padding: '10px 14px',
              flex: '1 1 160px', maxWidth: '240px',
            }}>
              <div style={{ fontWeight: 700, marginBottom: b.items ? '6px' : 0 }}>{b.label}</div>
              {b.items && (
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.92em' }}>
                  {b.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FlowSteps — a linear sequence of steps connected by arrows. Replaces
// broken horizontal flows like:
//   [ Power On ] --(x)--> [ POST Runs ] --(x)--> [ OS Loads ]
// Wraps to multiple rows automatically on narrow screens.
// ---------------------------------------------------------------------------
export function FlowSteps({ steps = [], color = 'blue' }) {
  const c = colorOf(color);
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center',
      gap: '8px', margin: '16px 0', justifyContent: 'center',
    }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{
            background: c.bg, border: `1px solid ${c.border}`, color: c.text,
            borderRadius: '8px', padding: '10px 14px', textAlign: 'center',
            flex: '1 1 140px', maxWidth: '200px',
          }}>
            <div style={{ fontWeight: 700 }}>{s.title}</div>
            {s.subtitle && <div style={{ fontSize: '0.85em', marginTop: '4px' }}>{s.subtitle}</div>}
          </div>
          {i < steps.length - 1 && (
            <div style={{ color: c.border, fontSize: '1.3em', fontWeight: 700 }} aria-hidden="true">&#8594;</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CompareGrid — 2-4 categories side by side, each with its own bullet list.
// Replaces broken two-column matrices like:
//   [ LITERAL RECALL ]            [ INFERENCE WORKSHOP ]
//   x Facts explicitly stated      x Reading between the lines
// ---------------------------------------------------------------------------
export function CompareGrid({ columns = [] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(columns.length, 4)}, minmax(160px, 1fr))`,
      gap: '12px', margin: '16px 0',
    }}>
      {columns.map((col, i) => {
        const c = colorOf(col.color);
        return (
          <div key={i} style={{
            background: c.bg, borderLeft: `4px solid ${c.border}`, color: c.text,
            borderRadius: '0 8px 8px 0', padding: '12px 14px',
          }}>
            <div style={{ fontWeight: 700, marginBottom: '6px' }}>{col.label}</div>
            {col.subtitle && <div style={{ fontSize: '0.85em', marginBottom: '6px', opacity: 0.85 }}>{col.subtitle}</div>}
            {col.items && (
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.92em' }}>
                {col.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScaleBar — an evenly spaced continuum (e.g. Always...Never, 100%...0%).
// Replaces broken lines like:
//   ALWAYS  USUALLY  OFTEN  SOMETIMES  NEVER
//   100% ---- 80% ---- 60% ---- 40% ---- 0%
// ---------------------------------------------------------------------------
export function ScaleBar({ points = [], color = 'teal' }) {
  const c = colorOf(color);
  return (
    <div style={{ margin: '16px 0' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        borderTop: `3px solid ${c.border}`, paddingTop: '8px',
      }}>
        {points.map((p, i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontWeight: 700, color: c.text }}>{p.label}</div>
            {p.value !== undefined && <div style={{ fontSize: '0.85em', opacity: 0.75 }}>{p.value}%</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NestedBoxes — concentric containment (e.g. WAN > MAN > LAN > PAN).
// ---------------------------------------------------------------------------
export function NestedBoxes({ layers = [] }) {
  return (
    <div style={{ margin: '16px 0' }}>
      {layers.reduceRight((inner, layer, i) => {
        const c = colorOf(layer.color);
        return (
          <div key={i} style={{
            background: c.bg, border: `1px solid ${c.border}`, color: c.text,
            borderRadius: '8px', padding: '16px',
          }}>
            <div style={{ fontWeight: 700, marginBottom: inner ? '12px' : 0 }}>{layer.label}</div>
            {inner}
          </div>
        );
      }, null)}
    </div>
  );
}
