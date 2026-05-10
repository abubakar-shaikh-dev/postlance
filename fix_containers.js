const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('grep -rl "container " src/').toString().trim().split('\n');
files.forEach(f => {
  if (!f) return;
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/container mx-auto/g, 'w-full mx-auto');
  fs.writeFileSync(f, content);
});
