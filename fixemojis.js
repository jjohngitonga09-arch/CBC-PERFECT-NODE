const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(__dirname, 'frontend', 'src')

const REPLACEMENTS = [
  // All emoji unicode ranges -> empty string
  [/[\u{1F300}-\u{1FFFF}]/gu, ''],
  [/[\u{1F000}-\u{1F02F}]/gu, ''],
  [/[\u{1F0A0}-\u{1F0FF}]/gu, ''],
  [/[\u{1F100}-\u{1F1FF}]/gu, ''],
  [/[\u{1F200}-\u{1F2FF}]/gu, ''],
  [/[\u{1F900}-\u{1F9FF}]/gu, ''],
  [/[\u{1FA00}-\u{1FA6F}]/gu, ''],
  [/[\u{1FA70}-\u{1FAFF}]/gu, ''],
  [/[\u2600-\u26FF]/g, ''],
  [/[\u2700-\u27BF]/g, ''],
  [/[\u{2B50}]/gu, ''],
  [/[\uFFFD]/g, ''],

  // Remove emoji JSX props: emoji="..." or emoji={...}
  [/ emoji="[^"]*"/g, ''],
  [/ emoji='[^']*'/g, ''],
  [/ emoji=\{`[^`]*`\}/g, ''],
  [/ emoji=\{"[^"]*"\}/g, ''],

  // Remove emoji object keys: emoji: '...' or emoji: "..."
  [/\s*emoji:\s*'[^']*',?/g, ''],
  [/\s*emoji:\s*"[^"]*",?/g, ''],
  [/\s*emoji:\s*`[^`]*`,?/g, ''],

  // Clean up multiple spaces
  [/  +/g, ' '],
]

function fixFile(filePath) {
  let original = fs.readFileSync(filePath, 'utf8')
  let content = original
  for (const [pattern, replacement] of REPLACEMENTS) {
    content = content.replace(pattern, replacement)
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8')
    return true
  }
  return false
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let changed = 0
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      changed += walkDir(fullPath)
    } else if (/\.(jsx|js|tsx|ts)$/.test(entry.name)) {
      if (fixFile(fullPath)) {
        console.log('Fixed: ' + fullPath.replace(__dirname, '.'))
        changed++
      }
    }
  }
  return changed
}

console.log('Scanning all files for broken emojis...')
const total = walkDir(SRC_DIR)
console.log('\nDone! ' + total + ' file(s) cleaned.')
