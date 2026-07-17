const fs = require('fs');

// Landing pages that need a mobile menu added
const landingPages = [
  'lp-qgis.html',
  'lp-curso-aia.html',
  'lp-curso-sso.html',
  'lp-sensoriamento-remoto.html'
];

const mobileMenuHtml = `
    <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-controls="mobile-menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
  <nav id="mobile-menu" class="mobile-nav" aria-label="Menu móvel" hidden>
    <a href="index.html">Home</a><a href="sobre.html">Sobre</a><a href="servicos.html">Serviços</a><a href="treinamentos.html">Treinamentos</a><a href="blog.html">Insights</a><a href="contacto.html">Contacto</a>
    <a class="btn btn-primary" href="inscricao.html">Inscrever-me</a>
  </nav>`;

for (const file of landingPages) {
  if (!fs.existsSync(file)) {
    console.log('NOT FOUND: ' + file);
    continue;
  }
  
  let c = fs.readFileSync(file, 'utf8');
  
  // Skip if already has mobile-menu
  if (c.includes('id="mobile-menu"')) {
    console.log('SKIPPED (already has menu): ' + file);
    continue;
  }
  
  // Find the closing </div> before </header> and inject the menu toggle + mobile nav
  // The pattern is: nav-cta link followed by </div>\n</header>
  c = c.replace(
    /(<a class="btn btn-primary nav-cta"[^>]*>[^<]*<\/a>)\s*\n?\s*(<\/div>)\s*\n?\s*(<\/header>)/,
    '$1' + mobileMenuHtml + '\n$3'
  );
  
  fs.writeFileSync(file, c, 'utf8');
  console.log('UPDATED: ' + file);
}
