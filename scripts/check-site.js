const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = [
  "index.html",
  "orcamento.html",
  "en/index.html",
  "en/quote.html",
  "assets/css/site.css",
  "assets/js/site.js",
  "api/contact.js",
  "api/newsletter.js",
  "api/lib/mail.js",
  "robots.txt",
  "sitemap.xml",
  "vercel.json",
  ".env.example"
];

let failed = false;
for (const file of files) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    console.error(`Missing ${file}`);
    failed = true;
  }
}

for (const file of ["index.html", "orcamento.html", "en/index.html", "en/quote.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  for (const needle of ["/assets/css/site.css", "/assets/js/site.js"]) {
    if (!html.includes(needle)) {
      console.error(`${file} does not reference ${needle}`);
      failed = true;
    }
  }
}

const api = fs.readFileSync(path.join(root, "api/contact.js"), "utf8");
if (!api.includes("transporter.sendMail") || !api.includes("Recebemos o seu pedido")) {
  console.error("Contact API is missing the outbound or autoresponder email.");
  failed = true;
}

process.exit(failed ? 1 : 0);
