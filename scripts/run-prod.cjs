const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const candidates = ['dist/main.js', 'dist/src/main.js'];
const entry = candidates.find((rel) => fs.existsSync(path.join(root, rel)));

if (!entry) {
  console.error('Build output missing. Run: npm run build');
  console.error('Expected one of:', candidates.join(', '));
  process.exit(1);
}

require(path.join(root, entry));
