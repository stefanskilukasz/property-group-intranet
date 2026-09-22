// One-time extraction: pulls the PAGES object literal out of the design
// prototype (design/Intranet Property Group.dc.html) and dumps it as JSON
// seed data for the IntranetPages SharePoint list (Stage 2).
// Not part of the runtime build — run manually with node.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const srcPath = path.resolve(__dirname, '../../../design/Intranet Property Group.dc.html');
const outPath = path.resolve(__dirname, '../src/webparts/intranetShell/data/pages.seed.json');

const lines = fs.readFileSync(srcPath, 'utf8').split('\n');

function extractLiteral(startLine, endLine, varName) {
  const text = lines.slice(startLine, endLine + 1).join('\n')
    .replace(new RegExp('^\\s*' + varName + '\\s*=\\s*'), '')
    .replace(/;\s*$/, '');
  const script = new vm.Script('(' + text + ')');
  return script.runInNewContext({});
}

// 0-indexed line ranges (1-indexed source lines minus 1), read from the
// prototype's class-field layout at extraction time. Re-check these if the
// prototype file changes.
const pages = extractLiteral(1974, 2325, 'PAGES'); // lines 1975-2326
const brands = extractLiteral(1950, 1972, 'BRANDS'); // lines 1951-1973

const seed = { pages, brands };

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(seed, null, 2), 'utf8');
console.log('Wrote', Object.keys(pages).length, 'pages and', brands.length, 'brands to', outPath);
