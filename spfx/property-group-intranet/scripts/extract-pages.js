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
  return script.runInNewContext({ window: {} }); // some literals reference `window.__resources...`
}

// 0-indexed line ranges (1-indexed source lines minus 1), read from the
// prototype's class-field layout at extraction time. Re-check these if the
// prototype file changes.
const pages = extractLiteral(1974, 2325, 'PAGES'); // lines 1975-2326
const brands = extractLiteral(1950, 1972, 'BRANDS'); // lines 1951-1973
// photo uses `(window.__resources && window.__resources.xxx) || './assets/...'`;
// window.__resources is undefined in this vm context, so the `||` fallback
// naturally evaluates to the real './assets/...' path — no need to strip it.
const news = extractLiteral(1908, 1920, 'NEWS'); // lines 1909-1921
const reactionDefs = extractLiteral(1938, 1942, 'REACTION_DEFS'); // lines 1939-1943
const events = extractLiteral(2687, 2691, 'EVENTS'); // lines 2688-2692
const shortcutCatalog = extractLiteral(2922, 2934, 'SHORTCUT_CATALOG') // lines 2923-2935
  .map(s => (s.to === 'mapa' ? { ...s, to: 'biuro' } : s)); // mapa was folded into biuro (docs/design-handoff.md)
const shortcutDefault = extractLiteral(2935, 2935, 'SHORTCUT_DEFAULT'); // line 2936
const vocativeExceptions = extractLiteral(3193, 3193, 'VOC_EXC'); // line 3194
const kbEntries = extractLiteral(1924, 1936, 'KB'); // lines 1925-1937
const benefits = extractLiteral(1850, 1906, 'BENEFITS'); // lines 1851-1907
const staffRows = extractLiteral(2329, 2524, 'STAFF'); // lines 2330-2525 (array of [name, role, dept, team, pion] tuples)
const streets = extractLiteral(2728, 2733, 'STREETS'); // lines 2729-2734
const places = extractLiteral(2735, 2785, 'PLACES'); // lines 2736-2786

const seed = {
  pages, brands, news, reactionDefs, events, shortcutCatalog, shortcutDefault,
  vocativeExceptions, kbEntries, benefits, staffRows, streets, places
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(seed, null, 2), 'utf8');
console.log(
  'Wrote', Object.keys(pages).length, 'pages,', brands.length, 'brands,',
  news.length, 'news,', events.length, 'events,', shortcutCatalog.length, 'shortcuts to', outPath
);
