const fs = require("fs");
const path = "src/pages/student/Notes.jsx";
let txt = fs.readFileSync(path, "utf8");

const eol = txt.includes("\r\n") ? "\r\n" : "\n";
const lines = txt.split(/\r?\n/);

const titleIdx = lines.findIndex(l => l.includes("{card.title}</p>"));
if (titleIdx === -1) { console.error("title line not found"); process.exit(1); }

// the content paragraph should span the next 1-2 lines (it may wrap)
let endIdx = titleIdx + 1;
while (endIdx < lines.length && !lines[endIdx].includes("{card.content}</p>")) endIdx++;
if (endIdx >= lines.length) { console.error("content line not found"); process.exit(1); }

console.log("title line:", JSON.stringify(lines[titleIdx]));
for (let i = titleIdx+1; i <= endIdx; i++) console.log("content line:", JSON.stringify(lines[i]));

// indentation = leading whitespace of the title line
const indentMatch = lines[titleIdx].match(/^(\s*)/);
const indent = indentMatch ? indentMatch[1] : "";

const replacement = [
  `${indent}{grade.id === 'PP1' && card.title === 'Key Charts to Know' ? (`,
  `${indent}  <PP1KeyCharts />`,
  `${indent}) : (`,
  ...lines.slice(titleIdx+1, endIdx+1).map(l => "  " + l),
  `${indent})}`,
];

const newLines = [
  ...lines.slice(0, titleIdx+1),
  ...replacement,
  ...lines.slice(endIdx+1),
];

// also add the import
const importIdx = lines.findIndex(l => l.includes("import { CURRICULUM } from './curriculumData'"));
if (importIdx === -1) { console.error("import line not found"); process.exit(1); }
newLines.splice(importIdx+1, 0, "import { PP1KeyCharts } from './CurriculumCharts'");

fs.writeFileSync(path, newLines.join(eol), "utf8");
console.log("Done!");
