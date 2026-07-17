const fs = require('fs');

const pages = [
  'lp-curso-aia.html',
  'lp-curso-sso.html',
  'lp-sensoriamento-remoto.html',
  'lp-qgis.html'
];

for (const page of pages) {
  if (!fs.existsSync(page)) continue;
  let html = fs.readFileSync(page, 'utf8');
  
  // Replace the inline style of the hero media image to include max-height: none and remove object-fit: contain if it's there
  html = html.replace(/<figure class="hero-media"([^>]*)><img src="([^"]+)" alt="([^"]+)" style="([^"]+)">/g, (match, figAttrs, src, alt, style) => {
    // parse style
    let newStyle = style;
    if (!newStyle.includes('max-height:none')) {
      newStyle += 'max-height:none;';
    }
    // We can also remove object-fit:contain as it's not needed if we have no max-height
    newStyle = newStyle.replace(/object-fit:\s*contain;?/g, '');
    
    return `<figure class="hero-media"${figAttrs}><img src="${src}" alt="${alt}" style="${newStyle}">`;
  });
  
  fs.writeFileSync(page, html, 'utf8');
  console.log('Fixed ' + page);
}
