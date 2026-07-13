const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pages = fs
  .readdirSync(root)
  .filter((file) => /\.(html|php)$/i.test(file) && !file.startsWith("google") && file !== "auth.php");

const requiredFragments = [
  '<meta name="viewport"',
  '<meta name="description"',
  '<link rel="canonical"',
  'assets/css/arcambe-2026.css',
  'assets/js/arcambe-2026.js',
];

let failed = false;

for (const page of pages) {
  const fullPath = path.join(root, page);
  const html = fs.readFileSync(fullPath, "utf8");
  const missing = requiredFragments.filter((fragment) => !html.includes(fragment));
  const hasTitle = /<title>[^<]+<\/title>/i.test(html);
  const hasH1 = /<h1[\s>]/i.test(html) || page === "auth.php" || page === "sala-de-aula.php";

  if (missing.length || !hasTitle || !hasH1) {
    failed = true;
    console.error(`${page}: ${[
      ...missing.map((item) => `missing ${item}`),
      !hasTitle ? "missing title" : "",
      !hasH1 ? "missing h1" : "",
    ].filter(Boolean).join(", ")}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`Checked ${pages.length} pages successfully.`);
