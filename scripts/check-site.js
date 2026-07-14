const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pages = fs
  .readdirSync(root)
  .filter((file) => /\.(html|php)$/i.test(file) && !file.startsWith("google") && file !== "auth.php" && file !== "sala-de-aula.php");

const requiredFragments = [
  '<meta name="viewport"',
  '<meta name="description"',
  '<link rel="canonical"',
  'assets/css/site.css',
  'assets/js/site.js',
];

let failed = false;

for (const page of pages) {
  const fullPath = path.join(root, page);
  const html = fs.readFileSync(fullPath, "utf8");
  const missing = requiredFragments.filter((fragment) => !html.includes(fragment));
  const hasTitle = /<title>[^<]+<\/title>/i.test(html);
  const hasH1 = /<h1[\s>]/i.test(html);

  if (missing.length || !hasTitle || !hasH1) {
    failed = true;
    console.error(`${page}: ${[
      ...missing.map((item) => `missing ${item}`),
      !hasTitle ? "missing title" : "",
      !hasH1 ? "missing h1" : "",
    ].filter(Boolean).join(", ")}`);
  }
}

if (failed) process.exit(1);
console.log(`Checked ${pages.length} public HTML pages successfully.`);
