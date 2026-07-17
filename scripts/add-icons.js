const fs = require('fs');

const files = [
  'inscricao.html',
  'lp-curso-aia.html',
  'lp-curso-sso.html',
  'lp-sensoriamento-remoto.html'
];

const mpesaReplacement = '<label><input type="radio" name="pagamento" value="mpesa"><span><i class="fa-solid fa-mobile-screen" style="margin-right:6px; color:#e31837;"></i>M-Pesa</span></label>';
const emolaReplacement = '<label><input type="radio" name="pagamento" value="emola"><span><i class="fa-solid fa-mobile-screen" style="margin-right:6px; color:#ec6608;"></i>e-Mola</span></label>';
const paypalReplacement = '<label><input type="radio" name="pagamento" value="paypal"><span><i class="fa-brands fa-paypal" style="margin-right:6px; color:#00457c;"></i>PayPal</span></label>';
const cartaoReplacement = '<label><input type="radio" name="pagamento" value="cartao"><span><i class="fa-regular fa-credit-card" style="margin-right:6px; color:#2b3733;"></i>Cartão</span></label>';

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  
  html = html.replace(/<label><input type="radio" name="pagamento" value="mpesa"><span>M-Pesa<\/span><\/label>/, mpesaReplacement);
  html = html.replace(/<label><input type="radio" name="pagamento" value="emola"><span>e-Mola<\/span><\/label>/, emolaReplacement);
  html = html.replace(/<label><input type="radio" name="pagamento" value="paypal"><span>PayPal<\/span><\/label>/, paypalReplacement);
  html = html.replace(/<label><input type="radio" name="pagamento" value="cartao"><span>Cartão<\/span><\/label>/, cartaoReplacement);
  
  fs.writeFileSync(file, html, 'utf8');
  console.log('Updated icons in ' + file);
}
