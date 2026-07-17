const fs = require('fs');

const pages = [
  { file: 'lp-curso-aia.html', date: '2026-08-21T23:59:59' },
  { file: 'lp-qgis.html', date: '2026-08-21T23:59:59' },
  { file: 'lp-curso-sso.html', date: '2026-08-28T23:59:59' },
  { file: 'lp-sensoriamento-remoto.html', date: '2026-09-04T23:59:59' }
];

for (const p of pages) {
  if (!fs.existsSync(p.file)) continue;
  let html = fs.readFileSync(p.file, 'utf8');
  
  // Replace the literal string "${p.date}" with the actual date
  html = html.replace(/\$\{p\.date\}/g, p.date);
  
  fs.writeFileSync(p.file, html, 'utf8');
  console.log('Fixed countdown date in ' + p.file);
}
