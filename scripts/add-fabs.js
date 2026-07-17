const fs = require('fs');

// Add FAB CSS to site.css
let css = fs.readFileSync('assets/css/site.css', 'utf8');
const fabCss = `
/* Floating Action Buttons */
.fab-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 90;
}
.fab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  box-shadow: 0 4px 14px rgba(7,22,33,.15);
  color: #fff;
  font-size: 1.35rem;
  transition: .2s ease;
  position: relative;
  border: none;
  cursor: pointer;
  text-decoration: none;
}
.fab-btn span {
  position: absolute;
  right: 62px;
  background: var(--navy);
  color: #fff;
  font-size: .8rem;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translateX(10px);
  transition: .2s ease;
}
.fab-btn:hover span {
  opacity: 1;
  transform: translateX(0);
}
.fab-whatsapp { background: #25D366; }
.fab-whatsapp:hover { background: #1ebd5a; color: #fff; }
.fab-primary { background: var(--green); }
.fab-primary:hover { background: var(--green-dark); color: #fff; }
.fab-secondary { background: #fff; color: var(--green-dark); border: 1px solid var(--line); }
.fab-secondary:hover { border-color: var(--green); color: var(--green); }
`;
if (!css.includes('.fab-container')) {
  // Insert before media queries or at end
  css = css.replace(/@media \(max-width:1050px\)/, fabCss + '\n@media (max-width:1050px)');
  fs.writeFileSync('assets/css/site.css', css, 'utf8');
  console.log('Added FAB CSS to site.css');
}

// Also add mobile adjustments to responsive.css
let respCss = fs.readFileSync('assets/css/responsive.css', 'utf8');
const respFabCss = `
  .fab-container {
    bottom: 80px; /* Above the mobile-sticky-cta */
    right: 14px;
    gap: 10px;
  }
  .fab-btn {
    width: 46px;
    height: 46px;
    font-size: 1.2rem;
  }
  .fab-btn span { display: none; }
`;
if (!respCss.includes('.fab-container')) {
  respCss = respCss.replace(/@media \(max-width: 680px\) \{/, '@media (max-width: 680px) {\n' + respFabCss);
  fs.writeFileSync('assets/css/responsive.css', respCss, 'utf8');
  console.log('Added FAB responsive CSS');
}

const htmlToInject = `
<div class="fab-container">
  <a href="orcamento.html" class="fab-btn fab-secondary" aria-label="Solicitar Orçamento"><span>Orçamento</span><i class="fa-solid fa-file-invoice"></i></a>
  <a href="#inscricao" class="fab-btn fab-primary" aria-label="Inscrever-me"><span>Inscrever-me</span><i class="fa-solid fa-pen-to-square"></i></a>
  <a href="https://wa.me/258844172237" target="_blank" class="fab-btn fab-whatsapp" aria-label="WhatsApp"><span>WhatsApp</span><i class="fa-brands fa-whatsapp"></i></a>
</div>
`;

const pages = [
  'lp-curso-aia.html',
  'lp-curso-sso.html',
  'lp-sensoriamento-remoto.html',
  'lp-qgis.html'
];

for (const page of pages) {
  if (!fs.existsSync(page)) continue;
  let html = fs.readFileSync(page, 'utf8');
  
  if (!html.includes('fab-container')) {
    html = html.replace(/<\/body>/, htmlToInject + '</body>');
    fs.writeFileSync(page, html, 'utf8');
    console.log('Added FAB to ' + page);
  }
}
