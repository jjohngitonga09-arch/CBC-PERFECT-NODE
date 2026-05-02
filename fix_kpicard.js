const fs = require('fs');
const path = 'frontend/src/components/dashboard/KpiCard.jsx';
let c = fs.readFileSync(path, 'utf8');

// Add 'brand' color to the palette
c = c.replace(
  `purple: { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.25)'  },`,
  `purple: { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.25)'  },
    brand:  { accent: '#6366f1', bg: 'rgba(99,102,241,0.15)',   border: 'rgba(99,102,241,0.25)'   },`
);

// Add 'brand' to default icons
c = c.replace(
  `const defaultIcons = { blue:'👥', green:'✅', yellow:'⏳', red:'🔒', purple:'💳' }`,
  `const defaultIcons = { blue:'👥', green:'✅', yellow:'⏳', red:'🔒', purple:'💳', brand:'📊' }`
);

fs.writeFileSync(path, c, 'utf8');
console.log('✓ Added brand color to KpiCard');
