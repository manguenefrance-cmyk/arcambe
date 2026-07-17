const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Skip if already has responsive.css
  if (c.includes('responsive.css')) continue;
  
  // Bump site.css version
  c = c.replace(/site\.css\?v=\d+/g, 'site.css?v=7');
  
  // Add responsive.css after site.css
  c = c.replace(
    /<link rel="stylesheet" href="\/assets\/css\/site\.css\?v=7">/g,
    '<link rel="stylesheet" href="/assets/css/site.css?v=7">\n  <link rel="stylesheet" href="/assets/css/responsive.css?v=1">'
  );
  
  fs.writeFileSync(file, c, 'utf8');
  console.log('Updated: ' + file);
}
