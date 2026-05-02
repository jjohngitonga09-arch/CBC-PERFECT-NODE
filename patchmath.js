const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'student', 'MathKnowledge.jsx')

let content = fs.readFileSync(filePath, 'utf8')

// Replace the entire FormulaCard function with a flat version (no toggle)
const oldCard = /function FormulaCard\(\{[^}]+\}\)[\s\S]*?\n\}/
const newCard = `function FormulaCard({ item, color }) {
  return (
    <div style={{
      background: '#0d1117',
      border: '1px solid #1f2937',
      borderRadius: '10px', padding: '14px 16px', marginBottom: '8px',
    }}>
      <p style={{ fontWeight: 700, color: '#f9fafb', margin: '0 0 5px', fontSize: '.9rem' }}>{item.name}</p>
      <code style={{ background: color + '22', color: color, padding: '3px 10px', borderRadius: '6px', fontSize: '.82rem', fontFamily: 'monospace', display: 'inline-block', marginBottom: '10px' }}>{item.formula}</code>
      <p style={{ color: '#d1d5db', fontSize: '.85rem', lineHeight: 1.7, margin: '0 0 8px' }}>{item.explain}</p>
      <div style={{ background: '#0a0e17', borderRadius: '8px', padding: '10px 14px', borderLeft: '3px solid ' + color }}>
        <span style={{ fontSize: '.68rem', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '.5px' }}>Example: </span>
        <span style={{ color: '#c4b5fd', fontSize: '.85rem', fontFamily: 'monospace' }}>{item.example}</span>
      </div>
    </div>
  )
}`

content = content.replace(oldCard, newCard)

// Remove the useState import if FormulaCard was the only one using it
// (keep it if the main component still uses it for search)
// Actually search still uses useState so leave it

fs.writeFileSync(filePath, content, 'utf8')
console.log('Done! FormulaCard is now flat - no dropdowns.')
